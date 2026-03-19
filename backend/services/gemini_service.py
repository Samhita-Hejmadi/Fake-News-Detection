import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')

    def generate_content(self, prompt):
        print(f"DEBUG: GeminiService.generate_content called with prompt: {prompt[:50]}...")
        try:
            response = self.model.generate_content(prompt)
            if response and response.text:
                return response.text
            return None
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return None

gemini_service = GeminiService()
