from urllib.parse import urlparse

# High credibility domains
TRUSTED_DOMAINS = {
    "reuters.com": 95,
    "bbc.com": 95,
    "apnews.com": 95,
    "nytimes.com": 90,
    "wsj.com": 90,
    "theguardian.com": 90,
    "afp.com": 95,
    "factcheck.org": 98,
    "politifact.com": 98,
    "snopes.com": 98,
    "gov": 100,
    "edu": 90,
    "org": 60,
}

def calculate_credibility(sources):
    """
    Assign credibility weights to domains.
    Returns: {"credibility_score": 0-100}
    """
    if not sources:
        return {"credibility_score": 50} # Neutral score for no sources
        
    total_score = 0
    valid_sources = 0
    
    for source in sources:
        name = source.get("name", "").lower()
        # Simple domain matching
        score = 40 # Default low score
        
        for domain, weight in TRUSTED_DOMAINS.items():
            if domain in name:
                score = max(score, weight)
        
        total_score += score
        valid_sources += 1
        
    avg_score = total_score / valid_sources if valid_sources > 0 else 50
    return {"credibility_score": avg_score}
