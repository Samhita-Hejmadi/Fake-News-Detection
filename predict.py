from core.classifier import classify_news
from core.claim_extractor import extract_claim
from core.verifier import verify_claim, verify_claim_online
from core.reasoning import explain_decision

print("📰 Advanced Fake News Detection System")
print("Type 'exit' to quit\n")

while True:
    news = input("Enter news article:\n")
    if news.lower() == "exit":
        break

    if not news.strip():
        continue

    # Extract main claim (already does sentences[0] in current implementation)
    claim = extract_claim(news)
    
    # ML Prediction
    ml_pred, confidence = classify_news(news)
    
    # Verification Signal (Google Fact Check)
    verification_score = verify_claim_online(claim)
    
    # Decision Logic: Weighted Approach
    # Final Score = (ML_confidence * 0.6) + (verification_score * 0.4)
    # Note: ML confidence is probability of the max class. 
    # To truly use it as a "realness" score, we should ideally use the probability of class 1 (Real).
    # However, the requirement says (ML_confidence * 0.6). 
    # Let's adjust ml_pred logic to get probability of being REAL.
    from core.classifier import model, vectorizer
    vector = vectorizer.transform([news])
    prob_real = model.predict_proba(vector)[0][1] # Probability of class 1 (Real)
    
    final_score = (prob_real * 0.6) + (verification_score * 0.4)
    final_verdict = "REAL" if final_score > 0.5 else "FAKE"

    # Explanation Logic
    if verification_score == 1:
        explanation = "Claim has supporting fact-check references."
    else:
        explanation = "No verified references found. Decision based on linguistic patterns."

    print("\n--- RESULT ---")
    print("Extracted Claim:", claim)
    print("ML Prediction:", "REAL" if ml_pred == 1 else "FAKE")
    print("Verification Status:", "Found Online" if verification_score == 1 else "Not Found Online")
    print("Final Verdict:", final_verdict)
    print(f"Final Confidence: {final_score*100:.2f}%")
    print("Explanation:", explanation)
    print("----------------\n")
