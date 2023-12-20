from flask import Flask, request, jsonify
from database import create_mongo_connection

app = Flask(__name__)
client, db, collection = create_mongo_connection()

@app.route('/')
def index():
    return "Hello"

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()

    if not validate_user_data(data):
        return jsonify({"error": "Invalid user data"}), 400

    new_user = {
        "Username": data["Username"],
        "Password": data["Password"]
    }
    result = collection.insert_one(new_user)

    return jsonify({"message": "User added successfully", "user_id": str(result.inserted_id)}), 201

def validate_user_data(data):
    return "Username" in data and "Password" in data

if __name__ == '__main__':
    app.run(host="127.0.0.1", debug=True)
