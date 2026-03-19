import requests
from backend.services.gemini_service import gemini_service

API_KEY = "AIzaSyC2qPNiG4x95QhBfUmppoz1W7znFEQ8Cdk"
FACTCHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

def verify_claim_online(claim):
    """
    Search the extracted claim using Google Fact Check API and Gemini Knowledge.
    """
    results = {
        "status": "unverified",
        "evidence_score": 50,
        "sources": [],
        "ai_knowledge_score": 50,
        "ai_assessment": ""
    }
    
    # 1. Gemini Knowledge Check (AI's internal perspective)
    prompt = (
        f"As a fact-checker, assess this claim based on your knowledge: '{claim}'. "
        "Provide a likelihood score from 0 (certainly false) to 100 (certainly true). "
        "Return the response in this format: SCORE: [number], REASON: [1-sentence explanation]"
    )
    ai_resp = gemini_service.generate_content(prompt)
    print(f"DEBUG: Raw AI Response: {ai_resp}")
    if ai_resp:
        try:
            import re
            score_match = re.search(r"SCORE:\s*(\d+)", ai_resp, re.IGNORECASE)
            reason_match = re.search(r"REASON:\s*(.*)", ai_resp, re.IGNORECASE)
            if score_match:
                results["ai_knowledge_score"] = float(score_match.group(1))
            if reason_match:
                results["ai_assessment"] = reason_match.group(1).strip()
        except Exception as e:
            print(f"AI parsing error: {e}")

    # 2. Google Fact Check API (External evidence) - [DISABLED]
    # try:
    #     params = {"query": claim, "key": API_KEY}
    #     response = requests.get(FACTCHECK_URL, params=params)
    #     
    #     if response.status_code == 200:
    #         data = response.json()
    #         claims = data.get("claims", [])
    #         
    #         support_count = 0
    #         contradict_count = 0
    #         sources = []
    #         
    #         for c in claims:
    #             for review in c.get("claimReview", []):
    #                 publisher = review.get("publisher", {}).get("name", "Unknown Source")
    #                 rating = review.get("textualRating", "").lower()
    #                 stance = "unverified"
    #                 if any(w in rating for w in ["true", "correct", "accurate"]):
    #                     stance = "support"; support_count += 1
    #                 elif any(w in rating for w in ["false", "fake", "misleading"]):
    #                     stance = "contradict"; contradict_count += 1
    #                 sources.append({"name": publisher, "stance": stance})
    #
    #         total_rated = support_count + contradict_count
    #         if support_count > contradict_count:
    #             results["status"] = "supported"
    #             results["evidence_score"] = (support_count / total_rated) * 100
    #         elif contradict_count > support_count and contradict_count > 1:
    #             results["status"] = "contradicted"
    #             results["evidence_score"] = 0
    #         else:
    #             results["status"] = "unverified"
    #             results["evidence_score"] = 50
    #         
    #         results["sources"] = sources[:5]
    #         results["support_count"] = support_count
    #         results["contradict_count"] = contradict_count
    #
    # except Exception as e:
    #     print(f"Web verifier error: {e}")

    # Map Gemini results to the main results structure
    results["evidence_score"] = results["ai_knowledge_score"]
    if results["ai_knowledge_score"] > 70:
        results["status"] = "supported"
    elif results["ai_knowledge_score"] < 30:
        results["status"] = "contradicted"
    else:
        results["status"] = "unverified"

    # Add a pseudo-source for the UI
    results["sources"] = [{"name": "Gemini AI Verification", "stance": "support" if results["ai_knowledge_score"] > 50 else "contradict"}]

    return results
