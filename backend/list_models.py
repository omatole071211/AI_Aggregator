import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def list_available_models():
    api_key = os.getenv('GEMINI_API_KEY')
    client = genai.Client(api_key=api_key)
    
    print("Listing available models...")
    try:
        for model in client.models.list():
            print(f"Name: {model.name}, Display Name: {model.display_name}")
    except Exception as e:
        print(f"FAILED: {str(e)}")

if __name__ == "__main__":
    list_available_models()
