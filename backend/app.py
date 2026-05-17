import os
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import init_db, get_db_connection
from services.groq_service import get_groq_response
from services.gemini_service import get_gemini_response
import requests

def get_mistral_response(prompt):
    """
    Fetches response from Mistral AI using the requests library directly.
    """
    api_key = os.getenv('MISTRAL_API_KEY')
    
    if not api_key or api_key == 'your_mistral_api_key_here':
        return "[DUMMY] Mistral: Please provide a valid MISTRAL_API_KEY in .env"

    try:
        url = "https://api.mistral.ai/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistral-small-latest",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except Exception as e:
        return f"[ERROR] Mistral: {str(e)}"
from services.summary_service import generate_summary

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Database
init_db()

@app.route("/")
def home():
    return "Backend is running successfully!"

@app.route('/api/process', methods=['POST'])
def process_prompt():
    data = request.json
    prompt = data.get('prompt')
    selected_models = data.get('models', []) # e.g. ['openai', 'gemini', 'huggingface']

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    results = []
    
    # Simple concurrency for fetching responses
    def fetch_model_response(model_name, fetch_func):
        start_time = time.time()
        try:
            response = fetch_func(prompt)
            duration = round(time.time() - start_time, 2)
            word_count = len(response.split())
            results.append({
                'model_name': model_name,
                'response_text': response,
                'word_count': word_count,
                'response_time': duration
            })
        except Exception as e:
            results.append({
                'model_name': model_name,
                'response_text': f"Error: {str(e)}",
                'word_count': 0,
                'response_time': 0
            })

    threads = []
    model_map = {
        'groq': get_groq_response,
        'gemini': get_gemini_response,
        'mistral': get_mistral_response
    }

    for model_id in selected_models:
        if model_id in model_map:
            # We use a mapping for display names to keep them clean
            display_name = {
                'groq': 'Groq',
                'gemini': 'Google Gemini',
                'mistral': 'Mistral AI'
            }.get(model_id, model_id.capitalize())
            
            t = threading.Thread(target=fetch_model_response, args=(display_name, model_map[model_id]))
            threads.append(t)
            t.start()
    
    for t in threads:
        t.join()

    # Generate Summary
    summary = generate_summary(prompt, [r['response_text'] for r in results])

    # Save to Database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO interactions (prompt, summary) VALUES (?, ?)', (prompt, summary))
    interaction_id = cursor.lastrowid

    for r in results:
        cursor.execute('''
            INSERT INTO responses (interaction_id, model_name, response_text, word_count, response_time)
            VALUES (?, ?, ?, ?, ?)
        ''', (interaction_id, r['model_name'], r['response_text'], r['word_count'], r['response_time']))
    
    conn.commit()
    conn.close()

    return jsonify({
        'interaction_id': interaction_id,
        'prompt': prompt,
        'summary': summary,
        'responses': results
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM interactions ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    
    history = []
    for row in rows:
        history.append({
            'id': row['id'],
            'prompt': row['prompt'],
            'summary': row['summary'],
            'timestamp': row['timestamp']
        })
    
    conn.close()
    return jsonify(history)

@app.route('/api/history/<int:interaction_id>', methods=['GET'])
def get_interaction_details(interaction_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM interactions WHERE id = ?', (interaction_id,))
    interaction = cursor.fetchone()
    
    if not interaction:
        conn.close()
        return jsonify({'error': 'Not found'}), 404
    
    cursor.execute('SELECT * FROM responses WHERE interaction_id = ?', (interaction_id,))
    responses = cursor.fetchall()
    
    response_list = []
    for r in responses:
        response_list.append({
            'model_name': r['model_name'],
            'response_text': r['response_text'],
            'word_count': r['word_count'],
            'response_time': r['response_time']
        })
    
    detail = {
        'id': interaction['id'],
        'prompt': interaction['prompt'],
        'summary': interaction['summary'],
        'timestamp': interaction['timestamp'],
        'responses': response_list
    }
    
    conn.close()
    return jsonify(detail)

@app.route('/api/history/<int:interaction_id>', methods=['DELETE'])
def delete_interaction(interaction_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM responses WHERE interaction_id = ?', (interaction_id,))
        cursor.execute('DELETE FROM interactions WHERE id = ?', (interaction_id,))
        conn.commit()
        return jsonify({'message': 'Successfully deleted'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
