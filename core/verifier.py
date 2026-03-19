import requests

API_KEY = "AIzaSyC2qPNiG4x95QhBfUmppoz1W7znFEQ8Cdk"
FACTCHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

trusted_phrases = [
    "according to reuters",
    "according to bbc",
    "official statement",
    "government announced",
    "confirmed by",
    "study published",
    "experts said"
]

def verify_claim(claim):
    claim = claim.lower()
    for phrase in trusted_phrases:
        if phrase in claim:
            return "SUPPORTED"
    return "UNVERIFIED"

def verify_claim_online(claim):
    try:
        params = {
            "query": claim,
            "key": API_KEY
        }
        response = requests.get(FACTCHECK_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            # If 'claims' exists and is not empty, we consider it found
            if "claims" in data and len(data["claims"]) > 0:
                return 1
        return 0
    except Exception as e:
        print(f"Error connecting to Fact Check API: {e}")
        return 0
