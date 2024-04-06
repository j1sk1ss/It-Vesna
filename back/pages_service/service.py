# TODO: Tokenized access
# ==================
# Importing packages

from flask import Flask, request
from flask_cors import CORS

from login_page.login_page import register, login, restore_pass, send_verify_code, verify_mail


# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)


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


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')