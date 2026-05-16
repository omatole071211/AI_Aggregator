import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_legacy_sdk():
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"Testing Legacy SDK with key: {api_key[:10]}...")
    
    try:
        genai.configure(api_key=api_key)
        
        # In legacy SDK, model names often need 'models/' prefix
        model_id = 'gemini-2.0-flash'
        
        print(f"Testing connectivity with {model_id} on v1 (Legacy SDK default)...")
        model = genai.GenerativeModel(model_id)
        response = model.generate_content("Hello")
        
        if response and response.text:
            print(f"SUCCESS with Legacy SDK and {model_id}!")
            print(f"Response: {response.text}")
        else:
            print("Empty response.")
            
    except Exception as e:
        print(f"FAILED with Legacy SDK")
        print(f"Error: {e}")

if __name__ == "__main__":
    test_legacy_sdk()
