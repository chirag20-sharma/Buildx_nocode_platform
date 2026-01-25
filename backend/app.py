# app initialized
from flask import Flask
from db import users_collection

app = Flask(__name__)

@app.route("/")
def home():
    return "BuildX Backend Running with MongoDB"

@app.route("/test-db")
def test_db():
    users_collection.insert_one({
        "name": "Test User",
        "email": "test@buildx.com"
    })
    return "MongoDB Connected & Inserted"

if __name__ == "__main__":
    app.run(debug=True)