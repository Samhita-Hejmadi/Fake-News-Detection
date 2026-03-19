import pickle

model = pickle.load(open("model/fake_news_model.pkl", "rb"))
vectorizer = pickle.load(open("model/tfidf_vectorizer.pkl", "rb"))

def classify_news(text):
    vector = vectorizer.transform([text])
    pred = model.predict(vector)[0]      # 0 = Fake, 1 = Real
    prob = model.predict_proba(vector)[0].max()
    return pred, prob
