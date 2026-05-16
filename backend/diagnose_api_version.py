import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def compare_api_versions():
    api_key = os.getenv('GEMINI_API_KEY')
    model_id = 'gemini-2.5-flash'
    
    # Testing with different base_url configurations
    test_configs = [
        {"name": "Standard (Default)", "url": None},
        {"name": "Explicit v1 (Full Path)", "url": "https://generativelanguage.googleapis.com/v1"},
        {"name": "Explicit v1beta (Full Path)", "url": "https://generativelanguage.googleapis.com/v1beta"}
    ]
    
    for config in test_configs:
        v_name = config["name"]
        v_url = config["url"]
        print(f"\n--- Testing API Configuration: {v_name} ---")
        try:
            if v_url:
                client = genai.Client(
                    api_key=api_key,
                    http_options=types.HttpOptions(base_url=v_url)
                )
            else:
                client = genai.Client(api_key=api_key)
            
            # Using a futuristic model verified to work
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents="ping"
            )
            
            if response and response.text:
                print(f"SUCCESS with {v_name}!")
                print(f"Response: {response.text}")
            else:
                print(f"Empty response with {v_name}.")
                
        except Exception as e:
            print(f"FAILED with {v_name}")
            print(f"Error: {str(e)[:500]}")

if __name__ == "__main__":
    compare_api_versions()
