import os
def get_groq_response(prompt):
    """
    Fetches response from Groq API using the Llama 3 70B model.
    Known for extremely low latency.
    """
    try:
        from groq import Groq
    except ImportError:
        return "[ERROR] Groq: The 'groq' package is not installed."
    
    api_key = os.getenv('GROQ_API_KEY')
    
    if not api_key or api_key == 'your_groq_api_key_here':
        return "[DUMMY] Groq (Llama 3): Please provide a valid GROQ_API_KEY in .env"

    try:
        client = Groq(api_key=api_key)
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"[ERROR] Groq: {str(e)}"
