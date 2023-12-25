import pymongo
from schemas import user_schema, movie_schema, reservation_schema


def create_mongo_connection():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database_name = "Cinema"
    db = client[database_name]

    collection_name1 = "Users"
    if collection_name1 not in db.list_collection_names():
        db.create_collection(collection_name1)

    db.command({"collMod": collection_name1, "validator": user_schema, "validationLevel": "strict",
                "validationAction": "error"})

    collection_name2 = "Movies"
    if collection_name2 not in db.list_collection_names():
        db.create_collection(collection_name2)

    db.command({"collMod": collection_name2, "validator": movie_schema, "validationLevel": "strict",
                "validationAction": "error"})

    collection_name3 = "Reservations"
    if collection_name3 not in db.list_collection_names():
        db.create_collection(collection_name3)

    db.command({"collMod": collection_name3, "validator": reservation_schema, "validationLevel": "strict",
                "validationAction": "error"})

    return client, db, db[collection_name1], db[collection_name2], db[collection_name3]


client, db, collection_users, collection_movies, collection_reservations = create_mongo_connection()
