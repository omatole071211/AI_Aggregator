import os
def get_mistral_response(prompt):
    """
    Fetches response from Mistral AI using the Mistral Large model.
    """
    try:
        from mistralai.client import Mistral
    except ImportError:
        return "[ERROR] Mistral: The 'mistralai' package is not installed or broken (check Windows Long Path support)."
    
    api_key = os.getenv('MISTRAL_API_KEY')
    
    if not api_key or api_key == 'your_mistral_api_key_here':
        return "[DUMMY] Mistral: Please provide a valid MISTRAL_API_KEY in .env"

    try:
        client = Mistral(api_key=api_key)
        
        chat_response = client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
        
        return chat_response.choices[0].message.content
    except Exception as e:
        return f"[ERROR] Mistral: {str(e)}"
