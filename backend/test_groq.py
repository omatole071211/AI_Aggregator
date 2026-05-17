import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def test_groq():
    api_key = os.getenv('GROQ_API_KEY')
    print(f"Testing Groq with key: {api_key[:10]}...")
    
    try:
        client = Groq()
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": "Hello!"}],
        )
        print("Success! Response:")
        print(completion.choices[0].message.content)
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_groq()
