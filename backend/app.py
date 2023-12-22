from flask import Flask
from user_routes import user_routes

app = Flask(__name__)


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


user_routes.after_request(add_cors_headers)
app.register_blueprint(user_routes)
if __name__ == '__main__':
    app.run(host="127.0.0.1", debug=True)
