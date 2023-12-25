from flask import Blueprint, request, jsonify

from user_routes import token_required
from database import collection_movies as movies_collection
from database import collection_users as users_collection
from database import collection_reservations as reservations_collection
import re
import os
from bson import ObjectId

movie_routes = Blueprint("movie_routes", __name__)
SECRET_KEY = os.getenv("SECRET_KEY")


def generate_seats():
    rows = 8
    seats_per_row = 9
    seats = [{"row": i // seats_per_row + 1, "seat": i % seats_per_row + 1, "available": True}
             for i in range(rows * seats_per_row)]
    return seats


@movie_routes.route('/delete_movie/<movie_id>', methods=['DELETE'])
@token_required
def delete_movie(current_user, movie_id):
    user = users_collection.find_one({"_id": ObjectId(current_user)})

    if not user or not user["Email"].endswith("@ticketease.com"):
        return jsonify({"error": "Permission denied"}), 403

    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})

    if not movie:
        return jsonify({"error": "Movie not found"}), 404

    delete_result = movies_collection.delete_one({"_id": ObjectId(movie_id)})

    if delete_result.deleted_count > 0:
        return jsonify({"message": "Movie deleted successfully", "name": movie["Name"], "hour": movie["Hour"]}), 200
    else:
        return jsonify({"error": "Failed to delete movie"}), 500


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
        "Day": data["Day"],
        "Seats": generate_seats()
    }

    result = movies_collection.insert_one(new_movie)

    return jsonify({"message": "Movie added successfully", "movie_id": str(result.inserted_id),
                    "name": data["Name"], "hour": data["Hour"]}), 201


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


@movie_routes.route('/get_movies_by_person', methods=['POST'])
@token_required
def get_movies_by_person(current_user):
    data = request.get_json()

    if "Day" not in data or not data["Day"]:
        return jsonify({"error": "Day is required"}), 400

    day = data["Day"]

    reservations = reservations_collection.find({"User": ObjectId(current_user)})

    movie_ids = [reservation["Movie"] for reservation in reservations]

    movies = movies_collection.find({"_id": {"$in": movie_ids}, "Day": day})

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


@movie_routes.route('/reserve_seats', methods=['POST'])
@token_required
def reserve_seats(current_user):
    data = request.get_json()
    movie_id = data["movie_id"]
    selected_seats = data["selected_seats"]
    user = data["user"]

    if not movie_id or not selected_seats:
        return jsonify({"error": "Invalid request"}), 400

    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})

    if not movie:
        return jsonify({"error": "Movie not found"}), 404

    if user is not '':
        input_user = users_collection.find_one({"Username": user})
        current_user = input_user["_id"]

    existing_reservation_count = reservations_collection.count_documents({
        "Movie": ObjectId(movie_id),
        "User": ObjectId(current_user)
    })

    if existing_reservation_count > 0:
        return jsonify({"error": "Only one reservation per movie is allowed!"}), 400

    for seat in selected_seats:
        if not is_seat_available(movie, seat):
            return jsonify({"error": f"Seat {seat} is already reserved"}), 400

    update_result = movies_collection.update_one(
        {"_id": ObjectId(movie_id)},
        {"$set": {"Seats": reserve_seats_in_movie(movie["Seats"], selected_seats)}}
    )

    if update_result.modified_count > 0:
        reservations_collection.insert_one({
            "User": ObjectId(current_user),
            "Movie": ObjectId(movie_id),
            "Tickets": selected_seats
        })
        return jsonify({"message": "Seats reserved successfully"}), 200
    else:
        return jsonify({"error": "Failed to reserve seats"}), 500


def is_seat_available(movie, seat):
    return next((s for s in movie["Seats"] if
                 s["seat"] == int(seat) % 10 and s["row"] == int(seat) // 10 + 1 and s["available"]), None) is not None


def reserve_seats_in_movie(seats, selected_seats):
    for seat in seats:
        seat_index = f"{seat['row']}{seat['seat']}"
        if seat_index in selected_seats:
            seat["available"] = False
    return seats


@movie_routes.route('/get_reserved_seats', methods=['POST'])
def get_reserved_seats():
    data = request.get_json()
    movie_id = data["movie_id"]

    if not movie_id:
        return jsonify({"error": "Invalid request"}), 400

    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})

    if not movie:
        return jsonify({"error": "Movie not found"}), 404

    reserved_seats = [str(seat["row"] * 10 + seat["seat"]) for seat in movie["Seats"] if not seat["available"]]

    return jsonify({"reservedSeats": reserved_seats}), 200


@movie_routes.route('/get_reserved_seats_by_person', methods=['POST'])
@token_required
def get_reserved_seats_by_person(current_user):
    data = request.get_json()
    movie_id = data["movie_id"]

    if not movie_id:
        return jsonify({"error": "Invalid request"}), 400

    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})

    if not movie:
        return jsonify({"error": "Movie not found"}), 404

    reservation = reservations_collection.find_one({
        "Movie": ObjectId(movie_id),
        "User": ObjectId(current_user)
    })

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    reserved_seats = reservation["Tickets"]

    return jsonify({"reservedSeats": reserved_seats}), 200
