def fuse_decision(ml_confidence, evidence_score, credibility_score, status="unverified", ai_knowledge_score=50):
    """
    Combine scores using weighted fusion including AI Knowledge.
    """
    # 1. Base weights
    if status.lower() == "unverified":
        final_score = (0.5 * ml_confidence) + (0.3 * ai_knowledge_score) + (0.2 * credibility_score)
    elif status.lower() == "supported":
        final_score = (0.3 * ml_confidence) + (0.3 * evidence_score) + (0.2 * ai_knowledge_score) + (0.2 * credibility_score)
    else: # contradicted
        # If ML and AI both agree it's likely true, reduce the impact of the 'contradiction'
        if ml_confidence > 70 and ai_knowledge_score > 70:
            final_score = (0.4 * ml_confidence) + (0.4 * ai_knowledge_score) + (0.2 * credibility_score)
        else:
            final_score = (0.2 * ml_confidence) + (0.4 * evidence_score) + (0.2 * ai_knowledge_score) + (0.2 * credibility_score)
    
    # 2. Direct boost for high-confidence truths
    if ml_confidence > 75 and ai_knowledge_score > 75:
        final_score = max(final_score, 80)

    # Verdict thresholds
    if final_score > 65:
        verdict = "TRUE"
    elif final_score >= 40:
        verdict = "UNCERTAIN"
    else:
        verdict = "FAKE"
        
    return {
        "final_verdict": verdict,
        "final_confidence": round(final_score, 2),
        "ml_score": round(ml_confidence, 2),
        "evidence_score": round(evidence_score, 2),
        "ai_knowledge_score": round(ai_knowledge_score, 2),
        "credibility_score": round(credibility_score, 2)
    }
