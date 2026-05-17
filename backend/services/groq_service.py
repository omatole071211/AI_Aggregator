import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_groq_response(prompt):

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama3-8b-8192",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    result = response.json()

    print(result)

    if "choices" in result:
        return result["choices"][0]["message"]["content"]

    return f"Groq API Error: {result}"
