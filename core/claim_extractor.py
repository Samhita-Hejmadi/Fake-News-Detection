from backend.services.gemini_service import gemini_service

def extract_claim(text):
    prompt = f"Extract the single most important factual claim from the following news text for fact-checking. Return only the claim text, nothing else:\n\n{text}"
    claim = gemini_service.generate_content(prompt)
    
    if claim:
        return claim.strip()
    
    # Fallback to simple logic if Gemini fails
    sentences = text.split(".")
    return sentences[0].strip() if sentences else text
