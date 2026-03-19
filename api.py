from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.classifier import classify_news, model, vectorizer
from core.claim_extractor import extract_claim
from core.verifier import verify_claim
from core.reasoning import explain_decision
from backend.services.web_verifier import verify_claim_online
from backend.services.credibility_score import calculate_credibility
from backend.services.decision_engine import fuse_decision
import json
import os

app = FastAPI(title="Fake News Detection API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsRequest(BaseModel):
    news: str

class User(BaseModel):
    email: str
    password: str
    name: str = ""

# Simple JSON-based user storage
USERS_FILE = "users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

@app.post("/signup")
async def signup(user: User):
    users = load_users()
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user.email] = {"password": user.password, "name": user.name}
    save_users(users)
    return {"message": "User created successfully"}

@app.post("/login")
async def login(user: User):
    users = load_users()
    if user.email not in users or users[user.email]["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": {"email": user.email, "name": users[user.email]["name"]}}

@app.post("/analyze")
async def analyze_news(request: NewsRequest):
    if not request.news.strip():
        raise HTTPException(status_code=400, detail="News text cannot be empty")
    
    try:
        # 1. Claim Extraction
        claim = extract_claim(request.news)
        
        # 2. ML Classification
        # We need the probability of class 1 (REAL) for the decision engine
        vector = vectorizer.transform([request.news])
        ml_prob_real = model.predict_proba(vector)[0][1] * 100 # 0-100 scale
        ml_pred, _ = classify_news(request.news)
        
        # 3. Web Verification
        web_res = verify_claim_online(claim)
        evidence_score = web_res["evidence_score"]
        
        # 4. Credibility Scoring
        cred_res = calculate_credibility(web_res["sources"])
        cred_score = cred_res["credibility_score"]
        
        # 5. Hybrid Decision Engine
        decision = fuse_decision(
            ml_prob_real, 
            evidence_score, 
            cred_score, 
            web_res["status"], 
            web_res.get("ai_knowledge_score", 50)
        )
        
        # Keep existing reasoning/explanation logic or adapt it
        explanation = explain_decision(ml_pred, web_res["status"].upper())
        if web_res["status"] == "contradicted":
            explanation = "Extreme caution: Online sources contradict this claim. " + explanation
            
        return {
            "claim": claim,
            "ml_prediction": "REAL" if ml_pred == 1 else "FAKE",
            "ml_score": decision["ml_score"],
            "verification": web_res["status"].capitalize(),
            "evidence_score": decision["evidence_score"],
            "credibility_score": decision["credibility_score"],
            "sources": web_res["sources"],
            "final_verdict": decision["final_verdict"],
            "confidence": decision["final_confidence"],
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
