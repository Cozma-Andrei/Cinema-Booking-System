user_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["Username", "Password"],
        "properties": {
            "Username": {
                "bsonType": "string"
            },
            "Password": {
                "bsonType": "string"
            }
        }
    }
}
