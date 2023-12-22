from flask import Blueprint, request, jsonify
from database import collection
import re

user_routes = Blueprint("user_routes", __name__)


@user_routes.route('/register', methods=['POST'])
def add_user():
    data = request.get_json()
    validation_error = validate_user_data(data)

    if validation_error:
        return jsonify({"error": validation_error}), 400

    new_user = {
        "Email": data["Email"],
        "Username": data["Username"],
        "Password": data["Password"]
    }

    if email_exists(data['Email']):
        return jsonify({"error": "Email already exists"}), 400

    if user_exists(data['Username']):
        return jsonify({"error": "User already exists"}), 400

    result = collection.insert_one(new_user)

    return jsonify({"message": "User added successfully", "user_id": str(result.inserted_id)}), 201


def validate_user_data(data):
    if "Email" not in data or not data["Email"] or not is_valid_email(data["Email"]):
        return "Invalid email"

    if email_exists(data["Email"]):
        return "Email already exists"

    if "Username" not in data or not data["Username"]:
        return "Username is required"

    if user_exists(data["Username"]):
        return "Username already exists"

    if len(data["Username"]) < 4:
        return "Username should be at least 4 characters long"

    if "Password" not in data or not data["Password"]:
        return "Password is required"

    password = data["Password"]
    if len(password) < 5 or not any(char.isdigit() for char in password):
        return "Password should be at least 5 characters long and contain at least one number"

    return None


def is_valid_email(email):
    # Use a regular expression to check if the email is in a valid format
    email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    return bool(re.match(email_regex, email))


def email_exists(email):
    existing_user = collection.find_one({"Email": email})
    return existing_user is not None


def user_exists(username):
    existing_user = collection.find_one({"Username": username})
    return existing_user is not None
