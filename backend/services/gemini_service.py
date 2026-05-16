import os
from google import genai

def get_gemini_response(prompt):
    """
    Fetches response from Google Gemini API using the new google-genai SDK.
    Uses 'gemini-flash-latest' as it is the most stable free-tier model.
    """
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        return "[ERROR] Google Gemini: API key not found in environment variables."
    
    try:
        # Initialize the Client
        client = genai.Client(api_key=api_key)
        
        # Reverting to 2.5 to check if key is still valid for that model.
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        if response and response.text:
            return response.text
        else:
            return "[ERROR] Google Gemini: Received an empty response."
            
    except Exception as e:
        return f"[ERROR] Google Gemini: {str(e)}"
