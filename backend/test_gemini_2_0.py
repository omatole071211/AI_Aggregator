import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini_2_0():
    api_key = os.getenv('GEMINI_API_KEY')
    client = genai.Client(api_key=api_key)
    
    model_id = 'gemini-2.0-flash'
    print(f"Testing with model: {model_id}...")
    
    try:
        response = client.models.generate_content(
            model=model_id,
            contents="Say 'Gemini 2.0 is operational!'"
        )
        print(f"SUCCESS! {model_id} is working.")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"FAILED with {model_id}: {str(e)}")

if __name__ == "__main__":
    test_gemini_2_0()
