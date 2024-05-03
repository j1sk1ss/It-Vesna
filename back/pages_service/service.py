# TODO: Tokenized access
# ==================
# Importing packages

import requests
import time

from flask import Flask, request, jsonify
from flask_cors import CORS

from login_page.login_page import register, login, restore_pass, send_verify_code, verify_mail
from main_page.main_page import create_new_post, load_posts_by_category, change_post, delete_post_by_id
from application_page.application_page import create_application
from admin_page.admin_page import get_moderators, add_moderator, delete_moderator

# ==================
# Configuring server on starting

ALLOWED_IP = [
    'it-vesna-api-service-1'
] 

app = Flask(__name__)
CORS(app)

@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        print('[WARN] Ip address protection disabled')
        # abort(403)


#region [Login Page]

# =============================================================
#   Login Page
# =============================================================

# ============================
# Register new user
# POST  http://127.0.0.1:27000/back/register_user
# JSON request: {
#     "surname": "surname",
#     "name": "name",
#     "father_name": "fathersName",
#     "mail": "mail@example.com",
#     "password": "password"
# }
# RETURN: ID of registered user
@app.route('/back/register_user', methods=['POST'])
def register_new_user():
    data = request.json
    return {'ID': register(data['name'], data['surname'], data['father_name'], data['mail'], data['password'])}

# ============================
# Login user
# POST  http://127.0.0.1:27000/back/login_user
# JSON request: {
#     "mail": "mail@example.com",
#     "password": "password"
# }
# RETURN: 
# JSON {
#   "status": "logged" / "error",
#   "role": "user" / "moderator" / "none"
# }
@app.route('/back/login_user', methods=['POST'])
def login_user():
    data = request.json
    return login(data['mail'], data['password'])    


# ============================
# Restore user password (Delete old password, generate random new, change old to generated, send generaed to user's mail)
# POST  http://127.0.0.1:27000/back/restore_pass
# JSON request: {
#     "mail": "mail@example.com"
# }
# RETURN: success
@app.route('/back/restore_pass', methods=['POST'])
def restore_user_pass():
    data = request.json
    return restore_pass(data['mail'])


# ============================
# Send verification code to user's mail
# POST  http://127.0.0.1:27000/back/mail_verify
# JSON request: {
#     "mail": "mail@example.com"
# }
# RETURN: success
@app.route('/back/mail_verify', methods=['POST'])
def start_mail_verify():
    data = request.json
    return send_verify_code(data['mail'])


# ============================
# Check verification code from user's mail
# POST  http://127.0.0.1:27000/back/code_mail_check
# JSON request: {
#     "mail": "mail@example.com",
#     "code": "code"
# }
# RETURN: True or False
@app.route('/back/code_mail_check', methods=['GET'])
def end_mail_verify():
    data = request.json
    return verify_mail(data['mail'], data['code'])

#endregion

#region [Main Page]

# =============================================================
#   Main Page
# =============================================================

# ============================
# Load all posts from server by category
# GET  http://127.0.0.1:27000/back/posts
# JSON request: {
#     "category": "category"
# }
# RETURN:
# [{
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }, ... ]
@app.route('/back/posts', methods=['GET'])
def load_posts():
    data = request.json
    return load_posts_by_category(data['category'])


# ============================
# Delete post by post ID
# DELETE  http://127.0.0.1:27000/back/posts/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/back/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    return delete_post_by_id(post_id)


# ============================
# Create and post new post
# POST  http://127.0.0.1:27000/back/posts
# JSON request: {
#     "id": "user_id",
#     "data": "post_data",
#     "category": "post_category"
# }
# RETURN: "success" / "not found"
@app.route('/back/posts', methods=['POST'])
def create_post():
    data = request.json
    return create_new_post(data['id'], data['data'], data['category'])


# ============================
# Edit and post edited post
# POST  http://127.0.0.1:27000/back/posts/<int:post_id>
# JSON request: {
#     "pin": "pin (-1 - nchange / 0 - unpin / 1 - pin)",
#     "data": "new_data"
# }
# RETURN: "success" / "not found"
@app.route('/back/posts/<int:post_id>', methods=['PUT'])
def edit_post(post_id):
    data = request.json
    return change_post(post_id, data['pin'], data['data'])

#endregion

#region [Application Page]

# ============================
# Create a new application
# POST  http://127.0.0.1:27000/back/application
# JSON request: {
#     "id": "user_id",
#     "authors": "authors",
#     "mail": "mail",
#     "nomination": "nomination",
#     "institution": "institution",
#     "links": "links",
#     "name": "name",
#     "description": "description"
# }
# FILE: File needed
# RETURN: application id
@app.route('/back/application', methods=['POST'])
def new_application():
    data = request.json
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    return create_application(data['id'], 
                              data['authors'], 
                              data['mail'], 
                              data['nomination'], 
                              data['institution'], 
                              data['links'], 
                              data['name'], 
                              data['description'], 
                              file)

#endregion

#region [Admin Page]

# ============================
# Load all moderators
# GET  http://127.0.0.1:27000/back/moderators
# RETURN:
# RETURN: [{
#     'UID':         user.uid,
#     'Surname':     user.surname,
#     'Name':        user.name,
#     'FathersName': user.fathersname,
#     'Mail':        user.mail
# }, ... ]
@app.route('/back/moderators', methods=['GET'])
def all_moderators():
    return jsonify(get_moderators())

# ============================
# Add new moderator
# POST  http://127.0.0.1:27000/back/moderators
# JSON request: {
#     "mail": "mail",
#     "name": "name"
# }
# RETURN: 'success' / 'failed' / 'not success'
@app.route('/back/moderators', methods=['POST'])
def new_moderator():
    data = request.json
    return add_moderator(data['mail'], data['name'])

# ============================
# Add new moderator
# DELETE  http://127.0.0.1:27000/back/moderators
# JSON request: {
#     "id": "id"
# }
# RETURN: 'success' / 'failed' / 'not success'
@app.route('/back/moderators', methods=['DELETE'])
def del_moderator():
    data = request.json
    return delete_moderator(data['id'])

#endregion

# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')