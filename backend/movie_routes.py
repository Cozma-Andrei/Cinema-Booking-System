from flask import Blueprint, request, jsonify

from user_routes import token_required
from database import collection_movies as movies_collection
from database import collection_users as users_collection
import re
import os
from bson import ObjectId

movie_routes = Blueprint("movie_routes", __name__)
SECRET_KEY = os.getenv("SECRET_KEY")


@movie_routes.route('/add_movie', methods=['POST'])
@token_required
def add_movie(current_user):
    user = users_collection.find_one({"_id": ObjectId(current_user)})

    if not user or not user["Email"].endswith("@ticketease.com"):
        return jsonify({"error": "Permission denied"}), 403

    data = request.get_json()
    validation_error = validate_movie_data(data)

    if validation_error:
        return jsonify({"error": validation_error}), 400

    new_movie = {
        "Name": data["Name"],
        "Categories": data["Categories"],
        "Duration": data["Duration"],
        "Hour": data["Hour"],
        "Image_url": data["Image_url"],
        "Day": data["Day"]
    }

    result = movies_collection.insert_one(new_movie)

    return jsonify({"message": "Movie added successfully", "movie_id": str(result.inserted_id)}), 201


def validate_movie_data(data):
    if "Name" not in data or not data["Name"]:
        return "Movie name is required"

    if "Categories" not in data or not data["Categories"] or not isinstance(data["Categories"], list):
        return "Categories are required and should be a list of strings"

    if "Duration" not in data or not data["Duration"]:
        return "Duration is required"

    if "Hour" not in data or not data["Hour"] or not re.match(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$', data["Hour"]):
        return "Invalid hour format. Please use HH:MM"

    if "Image_url" not in data or not data["Image_url"]:
        return "Image URL is required"

    if "Day" not in data or not data["Day"]:
        return "Day is required"

    return None


@movie_routes.route('/get_movies_by_day', methods=['POST'])
def get_movies_by_day():
    data = request.get_json()

    if "Day" not in data or not data["Day"]:
        return jsonify({"error": "Day is required"}), 400

    day = data["Day"]

    movies = movies_collection.find({"Day": day})

    movie_list = []
    for movie in movies:
        movie_data = {
            "id": str(movie["_id"]),
            "Name": movie["Name"],
            "Categories": movie["Categories"],
            "Duration": movie["Duration"],
            "Hour": movie["Hour"],
            "Image_url": movie["Image_url"],
            "Day": movie["Day"]
        }
        movie_list.append(movie_data)

    return jsonify({"movies": movie_list}), 200
