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
