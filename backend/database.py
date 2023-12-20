import pymongo
from schemas import user_schema

def create_mongo_connection():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database_name = "Cinema"
    db = client[database_name]

    collection_name = "Users"
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)

    db.command({"collMod": collection_name, "validator": user_schema, "validationLevel": "strict", "validationAction": "error"})
    return client, db, db[collection_name]
