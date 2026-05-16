import os
from mistralai.client import Mistral
from dotenv import load_dotenv

load_dotenv()

def test_mistral():
    api_key = os.getenv('MISTRAL_API_KEY')
    print(f"Testing Mistral with key: {api_key[:10]}...")
    
    try:
        client = Mistral(api_key=api_key)
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[{"role": "user", "content": "Hello!"}],
        )
        print("Success! Response:")
        print(response.choices[0].message.content)
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_mistral()
