# =============================================================
# Importing packages
# flask - flask app body
# cors - ajax support
# limiter - limits support (like 1 access per minute)
# jwtmanager - access token support

from data_base.users_data_base import db_add_user, db_delete_user, db_get_user_by_id, db_update_user, db_get_user_by_mail
from data_base.pass_data_base import db_change_password, db_get_password
from data_base.notify_data_base import db_add_notify, db_delete_notify, db_is_notify
from data_base.moder_data_base import db_add_moderator, db_delete_moderator, db_get_moderator, db_get_moders

from mail.mail import ml_send_mail
from crypto.crypto import crypto_str2hash

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


# =============================================================
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


# =============================================================
#   Info API
# =============================================================

# ============================
# Check server status
@app.route('/api/alive', methods=['GET'])   # API link that listens by this handler
@limiter.limit("10 per minute")             # Limiter for triggers
def alive_answer():
    return jsonify({'response': "I'm alive!"})


# =============================================================
#   Users DB API
# =============================================================

# ============================
# Add new user
# POST  http://it-vesna-api-service-1/api/add_user
# JSON request: {
#     "surname": "surname",
#     "name": "name",
#     "father_name": "fathersName",
#     "mail": "mail@example.com",
#     "password": "password"
# }
# RETURN: user ID
@app.route('/api/add_user', methods=['POST'])
def add_user():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['password'])
    return db_add_user(data['surname'], data['name'], data["father_name"], data["mail"], pass_hash, pass_salt)


# ============================
# Delete user
# DELETE  http://it-vesna-api-service-1/api/delete_user
# JSON request: {
#     "ID": "user_id"
# }
# RETURN: success
@app.route('/api/delete_user', methods=['DELETE'])
def delete_user():
    data = request.json
    return db_delete_user(data["ID"])


# ============================
# Update users data
# PUT http://it-vesna-api-service-1/api/update_user
# JSON request: {
#     "ID": "user_id"
#     "surname": "NewSurname",
#     "name": "NewName",
#     "father_name": "NewFathersName",
#     "mail": "new_email@example.com"
# }
# RETURN: success
@app.route('/api/update_user', methods=['POST'])
def update_user():
    data = request.json
    return db_update_user(data['surname'], data['name'], data['father_name'], data['mail'], data['ID'])


# ============================
# Get user data by ID
# GET http://it-vesna-api-service-1/api/user_by_id
# JSON request: {
#     "ID": "user_id"
# }
# RETURN:
# JSON response: {
#     'UID': 'UID',
#     'Surname': 'Surname',
#     'Name': 'Name',
#     'FathersName': 'FathersName',
#     'Mail': 'Mail'
# }
@app.route('/api/user_by_id', methods=['GET'])
def get_user_by_id():
    data = request.json
    return db_get_user_by_id(data['ID'])


# ============================
# Get user data by mail
# GET http://it-vesna-api-service-1/api/user_by_mail
# JSON request: {
#     "mail": "mail"
# }
# RETURN:
# JSON response: {
#     'UID': 'UID',
#     'Surname': 'Surname',
#     'Name': 'Name',
#     'FathersName': 'FathersName',
#     'Mail': 'Mail'
# }
@app.route('/api/user_by_mail', methods=['GET'])
def get_user_by_mail():
    data = request.json
    return db_get_user_by_mail(data['mail'])


# =============================================================
#   Passwords DB API
# =============================================================

# ============================
# Change password
# POST http://it-vesna-api-service-1/api/change_pass
# JSON request: {
#     "ID": "user_id",
#     "password": "new_pass"
# }
# RETURN: success
@app.route('/api/change_pass', methods=['POST'])
def change_password():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['password'])
    return db_change_password(pass_hash, pass_salt, data['ID'])


# ============================
# Get password by id
# POST http://it-vesna-api-service-1/api/get_pass
# JSON request: {
#     "ID": "user_id"
# }
# RETURN:
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/api/get_pass', methods=['GET'])
def get_password():
    data = request.json
    return db_get_password(data['ID'])


# ============================
# Hash string value
# POST http://it-vesna-api-service-1/api/str2hash
# JSON request: {
#     "data": "data"
#     "salt": "salt" 
# }
# RETURN:
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/api/str2hash', methods=['GET'])
def str2hash():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['data'], data['salt'])

    ret_data = {
        "hash": pass_hash,
        "salt": pass_salt
    }

    return ret_data


# =============================================================
#   Notifications DB API
# =============================================================

# ============================
# Enable notification for user
# POST  http://it-vesna-api-service-1/api/notificated
# JSON request: {
#     "user_id": "user_id",
#     "type": "type"
# }
# RETURN: success
@app.route('/api/notificated', methods=['POST'])
def add_notificated():
    data = request.json
    return db_add_notify(data['user_id'], data['type'])


# ============================
# Disable notification for user
# DELETE  http://it-vesna-api-service-1/api/notificated
# JSON request: {
#     "user_id": "user_id"
# }
# RETURN: success
@app.route('/api/notificated', methods=['DELETE'])
def delete_notificated():
    data = request.json
    return db_delete_notify(data['user_id'])


# =============================================================
#   Moderators DB API
# =============================================================

# ============================
# Get all moderators
# GET  http://it-vesna-api-service-1/api/moderator
# RETURN: list of moderators (Just user id)
@app.route('/api/moderator', methods=['GET'])
def get_moderators():
    return db_get_moders()


# ============================
# Get moderator by id
# GET  http://it-vesna-api-service-1/api/moderator/<int:user_id>
# RETURN: moderator (user id) / 'moderator not found'
@app.route('/api/moderator/<int:user_id>', methods=['GET'])
def get_moderator(user_id):
    return db_get_moderator(user_id)


# ============================
# Add moderator by ID (User should be exists)
# POST  http://it-vesna-api-service-1/api/moderator
# JSON request: {
#     "user_id": "user_id"
# }
# RETURN: success
@app.route('/api/moderator', methods=['POST'])
def add_moderator():
    data = request.json
    return db_add_moderator(data['user_id'])


# ============================
# Add moderator by ID (User should be exists)
# DELETE  http://it-vesna-api-service-1/api/moderator
# JSON request: {
#     "user_id": "user_id"
# }
# RETURN: success
@app.route('/api/moderator', methods=['DELETE'])
def delete_moderator():
    data = request.json
    return db_delete_moderator(data['user_id'])


# =============================================================
#   Mailing API
# =============================================================

# ============================
# Send mail
# POST  http://it-vesna-api-service-1/api/send2mail
# JSON request: {
#     "destination": "destination",
#     "header": "header",
#     "text": "text",
#     "type": "type"
# }
# RETURN: success
@app.route('/api/send2mail', methods=['POST'])
def send_mail():
    data = request.json
    return ml_send_mail(data['destination'], data['header'], data['text'], data['type'])


# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')