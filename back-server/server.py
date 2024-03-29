# ==================
# Importing packages
# flask - main web server
# cors - ajax support
# limiter - limits support (like 1 access per minute)
# jwtmanager - access token support

import requests

from datetime import timedelta

from audit.log import log
from crypto.crypto import string2hash, compare_string_hash

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# ==================
# Micro services URLs

DB_SERVER = 'http://it-vesna-db-server-1:5100'
MAIL_SERVER = 'http://it-vesna-mail-server-1:5200'


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

# ============================
# Check server status
@app.route('/api/alive', methods=['GET'])   # API link that listens by this handler
@limiter.limit("10 per minute")             # Limiter for triggers
def alive_answer():
    log("Alive API call", "/api/alive")
    return jsonify({'response': "I'm alive!"})


# ============================
# Add new user
# POST /api/add_user
# JSON request: {
#     "surname": "Surname",
#     "name": "Name",
#     "father_name": "FathersName",
#     "mail": "Mail@example.com",
#     "password": "hash_value"
# }
# RETURN: success
@app.route('/api/add_user', methods=['POST'])
def add_user():
    log("Add user API call", "/api/add_user")
    
    data = request.json
    password = data["password"]
    pass_hash, pass_salt = string2hash(password)
    send_data = {
        "Surname": data["surname"],
        "Name": data["name"],
        "FathersName": data["father_name"],
        "Mail": data["mail"],
        "PasswordHash": pass_hash,
        "PasswordSalt": pass_salt
    }

    return requests.post(f'{DB_SERVER}/users', json=send_data)


# ============================
# Delete user
# POST /api/delete_user
# JSON request: {
#     "ID": "user_id"
# }
# RETURN: success
@app.route('/api/delete_user', methods=['POST'])
def delete_user(user_id):
    log("Delete user API call", "/api/delete_user")
    
    data = request.json
    user_id = data['ID']
    
    return requests.delete(f'{DB_SERVER}/users/{user_id}', json=data)


# ============================
# Update users data
# PUT /api/update_user
# JSON request: {
#     "ID": "user_id"
#     "surname": "NewSurname",
#     "name": "NewName",
#     "father_name": "NewFathersName",
#     "mail": "new_email@example.com"
# }
# RETURN: success
@app.route('/api/update_user', methods=['POST'])
def update_user(user_id):
    data = request.json
    user_id = data["ID"]

    send_data = {
        "Surname": data["surname"],
        "Name": data["name"],
        "FathersName": data["father_name"],
        "Mail": data["mail"]
    }
    
    return requests.put(f'{DB_SERVER}/users/{user_id}', json=send_data)


# ============================
# Change password
# PUT /passwords/<int:user_id>
# JSON request: {
#     "ID": "user_id"
#     "password": "new_pass",
# }
# RETURN: success
@app.route('/api/change_pass', methods=['POST'])
def change_password(user_id):
    data = request.json
    password = data["password"]
    pass_hash, pass_salt = string2hash(password)
    send_data = {
        "PasswordHash": pass_hash,
        "PasswordSalt": send_data
    }    
    
    return requests.put(f'{DB_SERVER}/passwords/{user_id}', json=send_data)


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')