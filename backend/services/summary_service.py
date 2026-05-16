import os
from google import genai

def generate_summary(prompt, responses):
    """
    Generates a synthesized summary based on multiple AI responses using Google Gemini.
    """
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        return f"Summary (Static Fallback): Analyzed {len(responses)} responses. Please provide a GEMINI_API_KEY to enable AI-powered synthesis."

    try:
        # Initialize the Client
        client = genai.Client(api_key=api_key)
        
        # Format the responses for the meta-prompt
        responses_text = ""
        for i, resp in enumerate(responses):
            responses_text += f"\n--- MODEL RESPONSE {i+1} ---\n{resp}\n"

        # Construct the meta-prompt
        meta_prompt = f"""
        You are an AI synthesis expert. Below is a user's original request and several different AI model responses. 
        Your task is to provide a concise, high-quality summary (around 3-5 sentences) that synthesizes the best insights into a single 'Collective Insight'.
        
        USER REQUEST: {prompt}
        
        {responses_text}
        
        Provide only the synthesized Collective Insight.
        """

        # Generate the summary using 'gemini-2.5-flash'
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=meta_prompt
        )
        
        if response and response.text:
            return response.text.strip()
        else:
            return "Collective Insight: Unable to generate dynamic summary. Please refer to the individual model responses above."

    except Exception as e:
        # Graceful fallback to basic summary logic
        return f"Collective Insight (Fallback): Analyzed {len(responses)} responses. Each model provided unique perspectives. (Error: {str(e)})"
