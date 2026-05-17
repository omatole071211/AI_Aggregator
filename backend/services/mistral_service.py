import os
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
        response.raise_for_status() # Optional: check for 4xx/5xx errors
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except Exception as e:
        return f"[ERROR] Mistral: {str(e)}"
