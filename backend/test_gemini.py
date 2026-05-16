import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def verify_fix():
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"API Key found: {api_key[:10]}...")
    
    try:
        client = genai.Client(api_key=api_key)
        model_id = 'gemini-2.5-flash'
        
        print(f"Verifying connectivity with new model: {model_id}...")
        response = client.models.generate_content(
            model=model_id,
            contents="Say 'System online and verified!'"
        )
        
        if response and response.text:
            print(f"\nSUCCESS! Gemini API is now working with {model_id}.")
            print(f"Response: {response.text}")
        else:
            print("\nEmpty response received.")
            
    except Exception as e:
        print(f"\nVerification Failed! Error: {str(e)}")

if __name__ == "__main__":
    verify_fix()
