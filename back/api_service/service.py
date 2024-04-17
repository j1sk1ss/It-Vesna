# =============================================================
# Importing packages
# flask - flask app body
# cors - ajax support
# limiter - limits support (like 1 access per minute)

from data_base.users_data_base import db_add_user, db_delete_user, db_get_user_by_id, db_update_user, db_get_user_by_mail
from data_base.pass_data_base import db_change_password, db_get_password
from data_base.notify_data_base import db_add_notify, db_delete_notify, db_is_notify
from data_base.moder_data_base import db_add_moderator, db_delete_moderator, db_get_moderator, db_get_moders
from data_base.posts_data_base import db_add_post, db_delete_post, db_get_posts, db_get_posts_by_category, \
db_get_posts_by_id, db_pin_post, db_unpin_post
from data_base.apl_data_base import db_add_application, db_delete_application, db_delete_application_in_approved, \
db_delete_application_in_archive, db_get_approved, db_get_archives, db_get_application, db_get_applications, \
db_application2approved, db_application2archive
from data_base.nom_data_base import db_add_nomination, db_delete_nomination, db_get_nomination, db_get_nominations

from file.file import file_get, file_put
from mail.mail import ml_send_mail
from crypto.crypto import crypto_str2hash

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address



# =============================================================
# Configuring server on starting
# 1) Set ajax support
# 2) Set pgAdmin, ssl and jwt 
# 3) Limiter, jwt and data base activating
 
app = Flask(__name__)
CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "10 per hour"],
    storage_uri="memory://",
)

ALLOWED_IP = [
    'it-vesna-pages-service-1'
]

@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        return 'ip not allowed'


#region [Users]
# =============================================================
#   Users DB API
# =============================================================

# ============================
# Add new user
# POST  http://it-vesna-api-service-1:27001/api/user
# JSON request: {
#     "surname": "surname",
#     "name": "name",
#     "father_name": "fathersName",
#     "mail": "mail@example.com",
#     "password": "password"
# }
# RETURN: user ID
@app.route('/api/user', methods=['POST'])
def add_user():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['password'])
    return db_add_user(data['surname'], data['name'], data["father_name"], data["mail"], pass_hash, pass_salt)


# ============================
# Delete user
# DELETE  http://it-vesna-api-service-1:27001/api/user/<int:user_id>
# RETURN: success
@app.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    return db_delete_user(user_id)


# ============================
# Update users data
# PUT http://it-vesna-api-service-1:27001/api/user
# JSON request: {
#     "ID": "user_id"
#     "surname": "NewSurname",
#     "name": "NewName",
#     "father_name": "NewFathersName",
#     "mail": "new_email@example.com"
# }
# RETURN: success
@app.route('/api/user', methods=['PUT'])
def update_user():
    data = request.json
    return db_update_user(data['surname'], data['name'], data['father_name'], data['mail'], data['ID'])


# ============================
# Get user data by ID or by Mail
# GET http://it-vesna-api-service-1:27001/api/user
# JSON request: {
#     "ID": "user_id" / "none",
#     "Mail": "mail" / "none"
# }
# RETURN:
# JSON response: {
#     'UID': 'UID',
#     'Surname': 'Surname',
#     'Name': 'Name',
#     'FathersName': 'FathersName',
#     'Mail': 'Mail'
# }
@app.route('/api/user', methods=['GET'])
def get_user():
    data = request.json
    if data['ID'] != "none":
        return db_get_user_by_id(data['ID'])
    else:
        return db_get_user_by_mail(data['Mail'])
#endregion

#region [Passwords]
# =============================================================
#   Passwords DB API
# =============================================================

# ============================
# Change password
# PUT http://it-vesna-api-service-1:27001/api/password
# JSON request: {
#     "ID": "user_id",
#     "password": "new_pass"
# }
# RETURN: success
@app.route('/api/password', methods=['PUT'])
def change_password():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['password'])
    return db_change_password(pass_hash, pass_salt, data['ID'])


# ============================
# Get password by id
# GET http://it-vesna-api-service-1:27001/api/password/<int:user_id>
# RETURN:
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/api/password/<int:user_id>', methods=['GET'])
def get_password(user_id):
    return db_get_password(user_id)


# ============================
# Hash string value
# POST http://it-vesna-api-service-1:27001/api/str2hash
# JSON request: {
#     "data": "data"
#     "salt": "salt" 
# }
# RETURN:
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/api/str2hash', methods=['POST'])
def str2hash():
    data = request.json
    pass_hash, pass_salt = crypto_str2hash(data['data'], data['salt'])

    ret_data = {
        "hash": pass_hash,
        "salt": pass_salt
    }

    return ret_data
#endregion

#region [Nominations]
# =============================================================
#   Notifications DB API
# =============================================================

# ============================
# Enable notification for user
# POST  http://it-vesna-api-service-1:27001/api/notificated
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
# DELETE  http://it-vesna-api-service-1:27001/api/notificated/<int:user_id>
# RETURN: success
@app.route('/api/notificated/<int:user_id>', methods=['DELETE'])
def delete_notificated(user_id):
    return db_delete_notify(user_id)
#endregion

#region [Moders]
# =============================================================
#   Moderators DB API
# =============================================================

# ============================
# Get all moderators
# GET  http://it-vesna-api-service-1:27001/api/moderator
# RETURN: list of moderators (Just user id)
@app.route('/api/moderator', methods=['GET'])
def get_moderators():
    return db_get_moders()


# ============================
# Get moderator by id
# GET  http://it-vesna-api-service-1:27001/api/moderator/<int:user_id>
# RETURN: moderator (user id) / 'moderator not found'
@app.route('/api/moderator/<int:user_id>', methods=['GET'])
def get_moderator(user_id):
    return db_get_moderator(user_id)


# ============================
# Add moderator by ID (User should be exists)
# POST  http://it-vesna-api-service-1:27001/api/moderator
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
# DELETE  http://it-vesna-api-service-1:27001/api/moderator
# RETURN: success
@app.route('/api/moderator/<int:user_id>', methods=['DELETE'])
def delete_moderator(user_id):
    return db_delete_moderator(user_id)



# =============================================================
#   Mailing API
# =============================================================

# ============================
# Send mail
# POST  http://it-vesna-api-service-1:27001/api/send_mail
# JSON request: {
#     "destination": "destination",
#     "header": "header",
#     "text": "text",
#     "type": "type"
# }
# RETURN: success
@app.route('/api/send_mail', methods=['POST'])
def send_mail():
    data = request.json
    return ml_send_mail(data['destination'], data['header'], data['text'], data['type'])
#endregion

#region [Posts]
# =============================================================
#   Posts API
# =============================================================

# ============================
# Create new post
# POST  http://it-vesna-api-service-1:27001/api/posts
# JSON request: {
#     "author": "author_UID",
#     "path": "path_where_post",
#     "category": "category"
# }
# RETURN: success
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    return db_add_post(data['author'], data['path'], data['category'])


# ============================
# Delete post
# DELETE  http://it-vesna-api-service-1:27001/api/posts/<int:post_id>
# RETURN: success / not found
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    return db_delete_post(post_id)


# ============================
# Get all posts
# GET http://it-vesna-api-service-1:27001/api/posts
# RETURN: 
# [{
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }, ... ]
@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    return db_get_posts()


# ============================
# Get posts by categy
# GET http://it-vesna-api-service-1:27001/api/posts/<string:category>
# RETURN: 
# [{
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }, ... ]
@app.route('/api/posts/<string:category>', methods=['GET'])
def get_posts_by_category(category):
    return db_get_posts_by_category(category)


# ============================
# Get post by post id
# GET http://it-vesna-api-service-1:27001/api/posts/<int:id>
# RETURN: 
# {
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }
@app.route('/api/posts/<int:id>', methods=['GET'])
def get_posts_by_id(id):
    return db_get_posts_by_id(id)


# ============================
# Pin post
# POST http://it-vesna-api-service-1:27001/api/posts/pinned/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/api/posts/pin/<int:id>', methods=['POST'])
def pin_post(id):
    return db_pin_post(id)


# ============================
# Unpin post
# POST http://it-vesna-api-service-1:27001/api/posts/unpinned/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/api/posts/pin/<int:id>', methods=['DELETE'])
def unpin_post(id):
    return db_unpin_post(id)
#endregion

#region [Applications]
# =============================================================
#   Applications API
# =============================================================

# ============================
# Create application 
# POST http://it-vesna-api-service-1:27001/api/applications
# JSON request: {
#     "user_id": "user_id",
#     "name": "name",
#     "path": "path"
# }
# RETURN: "success"
@app.route('/api/applications', methods=['POST'])
def create_application():
    data = request.json
    return db_add_application(data['user_id'], data['name'], data['path'])


# ============================
# Delete application 
# POST http://it-vesna-api-service-1:27001/api/applications/<int:user_id>
# RETURN: "success" / "not found"
@app.route('/api/applications/<int:user_id>', methods=['DELETE'])
def delete_application(user_id):
    return db_delete_application(user_id)


# ============================
# This function return all applications from users from db
# GET http://it-vesna-api-service-1:27001/api/applications
# No JSON request required for GET application
# RETURN: applications
# [{
#   'UID': 'User_UID',
#   'Path': 'Path_to_request_on_local'
# }, ... ]
@app.route('/api/applications', methods=['GET'])
def get_applications():
    return db_get_applications()


# ============================
# Get application by user_id
# GET http://it-vesna-api-service-1:27001/api/applications/user/<int:user_id>
# RETURN: "success"
@app.route('/api/applications/user/<int:user_id>', methods=['GET'])
def get_application_by_id(user_id):
    return db_get_application(user_id, -1)


# ============================
# Get application by user_id
# GET http://it-vesna-api-service-1:27001/api/applications/<int:application_id>
# RETURN: "success"
@app.route('/api/applications/<int:application_id>', methods=['GET'])
def get_application_by_apl_id(application_id):
    return db_get_application(-1, application_id)


# ============================
# Add application to archive
# POST http://it-vesna-api-service-1:27001/api/applications/archive/<int:application_id>
# JSON application: {
#     "ID": "application id"
# }
# RETURN: "success"
@app.route('/api/applications/archive/<int:application_id>', methods=['POST'])
def application2archive(application_id):
    return db_application2archive(application_id)


# ============================
# Delete application from archive
# DELETE http://it-vesna-api-service-1:27001/api/applications/archive/<int:application_id>
# RETURN: "success"
@app.route('/api/applications/archive/<int:application_id>', methods=['DELETE'])
def application_from_archive(application_id):
    return db_delete_application_in_archive(application_id)


# ============================
# This function return all archive from users from db
# GET http://it-vesna-api-service-1:27001/api/applications/archive
# No JSON request required for GET application
# RETURN: application
# [{
#   'UID': 'applicationid',
# }, ... ]
@app.route('/api/applications/archive', methods=['GET'])
def get_archive():
    return db_get_archives()


# ============================
# Add application to approved
# POST http://it-vesna-api-service-1:27001/api/applications/approve/<int:application_id>
# JSON application: {
#     "ID": "application id"
# }
# RETURN: "success"
@app.route('/api/applications/approve/<int:application_id>', methods=['POST'])
def application2approved(application_id):
    return db_application2approved(application_id)


# ============================
# Delete application from approve
# DELETE http://it-vesna-api-service-1:27001/api/applications/approve/<int:application_id>
# RETURN: "success"
@app.route('/api/applications/approve/<int:application_id>', methods=['DELETE'])
def application_from_approved(application_id):
    return db_delete_application_in_approved(application_id)


# ============================
# This function return all approve from users from db
# GET http://it-vesna-api-service-1:27001/api/applications/approve
# No JSON request required for GET application
# RETURN: application
# [{
#   'UID': 'applicationid',
# }, ... ]
@app.route('/api/applications/approved', methods=['GET'])
def get_approved():
    return db_get_approved()
#endregion

#region [Nominations]
# =============================================================
#   Nominations API
# =============================================================

# ============================
# Add nomination
# POST http://it-vesna-api-service-1:27001/api/nominations
# JSON request: {
#     "Name": "NominationName"
# }
@app.route('/api/nominations', methods=['POST'])
def add_nomination():
    data = request.json
    return db_add_nomination(data['name'])


# ============================
# Delete nomination
# DELETE http://it-vesna-api-service-1:27001/api/nominations/<int:nomination_id>
# No JSON request required for DELETE request
@app.route('/api/nominations/<int:nomination_id>', methods=['DELETE'])
def delete_nomination(nomination_id):
    return db_delete_nomination(nomination_id)


# ============================
# This function return all nominations from db
# GET http://it-vesna-api-service-1:27001/api/nominations
# No JSON request required for GET request
# RETURN: nom
# [{
#   'UID': 'nomination_id',
#   'Path': 'nomination_name'
# }, ... ]
@app.route('/api/nominations', methods=['GET'])
def get_nominations():
    return db_get_nominations()


# ============================
# Get nomination by id
# GET http://it-vesna-api-service-1:27001/api/nominations/<int:user_id>
# RETURN: "success"
@app.route('/api/nominations/<int:nomination_id>', methods=['GET'])
def get_nomination(nomination_id):
    return db_get_nomination(nomination_id)
#endregion

#region [Files]
# =============================================================
#   Files API
# =============================================================

# ==================
# Save transfered file
# POST http://it-vesna-api-service-1:27001/api/file
# JSON request: {
#     "path": "path"
# }
# FILE ATTACHMENT REQUIRED
# RETURN: "no file" / file path
@app.route('/api/file', methods=['POST'])
def put_file():
    data = request.json
    file = request.files['file']
    return file_put(file, data['path'])


# ==================
# Load file from server
# GET http://it-vesna-api-service-1:27001/api/file
# JSON request: {
#     "path": "file_path"
# }
# RETURN: file
@app.route('/api/file', methods=['GET'])
def get_file():
    data = request.json
    return file_get(data['path'])
#endregion


# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')