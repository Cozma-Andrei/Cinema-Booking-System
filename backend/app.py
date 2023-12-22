from flask import Flask
from user_routes import user_routes

app = Flask(__name__)
app.register_blueprint(user_routes)


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


app.after_request(add_cors_headers)
if __name__ == '__main__':
    app.run(host="127.0.0.1", debug=True)
