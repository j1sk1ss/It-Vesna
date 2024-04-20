# TODO: Tokenized access
# ==================
# Importing packages

from flask import Flask, request
from flask_cors import CORS

from login_page.login_page import register, login, restore_pass, send_verify_code, verify_mail
from main_page.main_page import create_new_post, load_posts_by_category, change_post, delete_post_by_id

# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)


#region [Login Page]

# =============================================================
#   Login Page
# =============================================================

# ============================
# Register new user
# POST  http://it-vesna-pages-service-1:27000/back/register_user
# JSON request: {
#     "surname": "surname",
#     "name": "name",
#     "father_name": "fathersName",
#     "mail": "mail@example.com",
#     "password": "password"
# }
# RETURN: ID of registered user
@app.route('/back/register_user', methods=['POST'])
def rester_new_user():
    data = request.json
    return register(data['name'], data['surname'], data['father_name'], data['mail'], data['password'])

# ============================
# Login user
# POST  http://it-vesna-pages-service-1:27000/back/login_user
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
# POST  http://it-vesna-pages-service-1:27000/back/restore_pass
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
# POST  http://it-vesna-pages-service-1:27000/back/mail_verify
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
# POST  http://it-vesna-pages-service-1:27000/back/code_mail_check
# JSON request: {
#     "mail": "mail@example.com",
#     "code": "code"
# }
# RETURN: True or False
@app.route('/back/code_mail_check', methods=['POST'])
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
# GET  http://it-vesna-pages-service-1:27000/back/posts
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
# DELETE  http://it-vesna-pages-service-1:27000/back/posts/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/back/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    return delete_post_by_id(post_id)


# ============================
# Create and post new post
# POST  http://it-vesna-pages-service-1:27000/back/posts
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
# POST  http://it-vesna-pages-service-1:27000/back/posts/<int:post_id>
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


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')