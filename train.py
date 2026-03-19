import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle, os

df = pd.read_csv("data/merged_fake_news.csv")

df['combined'] = df['title'] + " " + df['text']
df = df[df['combined'].str.split().str.len() > 50]

X = df['combined']
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

vectorizer = TfidfVectorizer(
    max_features=20000,
    min_df=5,
    max_df=0.8,
    ngram_range=(1,2),
    sublinear_tf=True
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=3000, class_weight="balanced")
model.fit(X_train_vec, y_train)

print("Accuracy:", accuracy_score(y_test, model.predict(X_test_vec)))

os.makedirs("model", exist_ok=True)
pickle.dump(model, open("model/fake_news_model.pkl", "wb"))
pickle.dump(vectorizer, open("model/tfidf_vectorizer.pkl", "wb"))
