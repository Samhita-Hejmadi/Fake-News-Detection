from backend.services.gemini_service import gemini_service

def explain_decision(ml_pred, verification):
    status = "REAL" if ml_pred == 1 else "FAKE"
    
    prompt = (
        f"Provide a concise but detailed explanation for why a news article was flagged as {status}. "
        f"The machine learning model predicted it as {status}, and online verification status is '{verification}'. "
        "Explain the reasoning behind this verdict in 2-3 sentences."
    )
    
    explanation = gemini_service.generate_content(prompt)
    
    if explanation:
        return explanation.strip()
        
    # Fallback logic
    if verification == "SUPPORTED":
        return "The claim is supported by trusted sources."
    if ml_pred == 0:
        return "The language pattern resembles known fake news."
    return "The decision is based on statistical language patterns."
