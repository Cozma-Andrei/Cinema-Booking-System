user_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["Email", "Username", "Password"],
        "properties": {
            "Email": {
                "bsonType": "string"
            },
            "Username": {
                "bsonType": "string"
            },
            "Password": {
                "bsonType": "string"
            }
        }
    }
}

movie_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["Name", "Categories", "Duration", "Hour", "Image_url", "Day"],
        "properties": {
            "Name": {
                "bsonType": "string"
            },
            "Categories": {
                "bsonType": "array",
                "items": {
                    "bsonType": "string"
                }
            },
            "Duration": {
                "bsonType": "string"
            },
            "Hour": {
                "bsonType": "string",
                "pattern": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
            },
            "Image_url": {
                "bsonType": "string"
            },
            "Day": {
                "bsonType": "string"
            }
        }
    }
}

reservation_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["User", "Movie", "Tickets"],
        "properties": {
            "User": {
                "bsonType": "objectId"
            },
            "Movie": {
                "bsonType": "objectId"
            },
            "Tickets": {
                "bsonType": "array",
                "items": {
                    "bsonType": "string"
                }
            }
        }
    }
}
