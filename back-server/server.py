# ==================
# Importing packages
# flask - main web server
# cors - ajax support
# limiter - limits support (like 1 access per minute)
# jwtmanager - access token support

import requests

from datetime import timedelta

from audit.log import log

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


# ==================
# Configuring server on starting
# 1) Set ajax support
# 2) Set pgAdmin, ssl and jwt 
# 3) Limiter, jwt and data base activating
 
app = Flask(__name__)
CORS(app)

jwt = JWTManager(app)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "10 per hour"],
    storage_uri="memory://",
)


# ==================
# Handlers
# 1) Test handler with limiter (10 api calls per minute)
# 2) Test handler for creating test User data

@app.route('/api/alive', methods=['GET'])   # API link that listens by this handler
@limiter.limit("10 per minute")             # Limiter for triggers
def alive_asnwer():
    log("Alive API call")
    return jsonify({'response': "I'm alive!"})


@app.route('/api/add_user', methods=['GET'])
def add_user():
    log("Add user API call")
    
    url = 'http://it-vesna-db-server-1:5100/users'
    data = {
        "Surname": "Иванов",
        "Name": "Иван",
        "FathersName": "Иванович",
        "Mail": "ivanov@example.com",
        "PasswordHash": "hash_value",
        "PasswordSalt": "salt_value"
    }

    response = requests.post(url, json=data)
    return 'success'


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')