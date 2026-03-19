import pickle

model = pickle.load(open("model/fake_news_model.pkl", "rb"))
vectorizer = pickle.load(open("model/tfidf_vectorizer.pkl", "rb"))

def predict_news(text):
    text_vector = vectorizer.transform([text])
    prediction = model.predict(text_vector)
    return "Real News" if prediction[0] == 1 else "Fake News"

while True:
    news = input("Enter news text (type exit to quit): ")
    if news.lower() == "exit":
        break
    print(predict_news(news))
