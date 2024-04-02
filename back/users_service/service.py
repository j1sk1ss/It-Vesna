# =============================================================
# Importing packages
# flask - main web server
# sqlalchemy - package for working with pgAdmin

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy



# =============================================================
# Configuring server on starting

ALLOWED_IP = [
    'it-vesna-api-service-1'
]  

DB_NAME = "it-vesna-users-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-users-db-service-1:5101"


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER_NAME}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        return 'ip not allowed'



# =============================================================
# Setup SQL models

class Users(db.Model):
    uid         = db.Column(db.Integer, primary_key=True)
    surname     = db.Column(db.String(255))
    name        = db.Column(db.String(255))
    fathersname = db.Column(db.String(255))
    mail        = db.Column(db.String(255))

class Admins(db.Model):
    user_uid = db.Column(db.Integer, db.ForeignKey('users.uid'), primary_key=True)

class Moderators(db.Model):
    user_uid = db.Column(db.Integer, db.ForeignKey('users.uid'), primary_key=True)

class Passwords(db.Model):
    user_uid     = db.Column(db.Integer, db.ForeignKey('users.uid'), primary_key=True)
    passwordhash = db.Column(db.String(255))
    passwordsalt = db.Column(db.String(255))

class Nominations(db.Model):
    uid  = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

class Notificated(db.Model):
    user_uid         = db.Column(db.Integer, db.ForeignKey('users.uid'), primary_key=True)
    notificationtype = db.Column(db.Integer)



# =============================================================
#   API for working with data about users from DB
# =============================================================

# ============================
# This function return all users from db
# GET http://it-vesna-users-db-service-1:5100/users
# No JSON request required for GET request
@app.route('/users', methods=['GET'])
def get_users():
    users  = Users.query.all()
    result = []
    for user in users:
        user_data = {
            'UID':         user.uid,
            'Surname':     user.surname,
            'Name':        user.name,
            'FathersName': user.fathersname,
            'Mail':        user.mail
        }
        
        result.append(user_data)
        
    return jsonify(result)


# ============================
# This function return user by ID from bd
# GET http://it-vesna-users-db-service-1:5100/users/<int:user_id>
# No JSON request required for GET request
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = Users.query.filter_by(uid=user_id).first()
    if user:
        user_data = {
            'UID':         user.uid,
            'Surname':     user.surname,
            'Name':        user.name,
            'FathersName': user.fathersname,
            'Mail':        user.mail
        }
        
        return jsonify(user_data)
    else:
        return 'user not found'
    

# ============================
# This function return user by ID from bd
# GET http://it-vesna-users-db-service-1:5100/user_by_mail
# No JSON request required for GET request
@app.route('/user_by_mail', methods=['GET'])
def get_user_by_mail():
    data = request.json
    user = Users.query.filter_by(mail=data['mail']).first()
    if user:
        user_data = {
            'UID':         user.uid,
            'Surname':     user.surname,
            'Name':        user.name,
            'FathersName': user.fathersname,
            'Mail':        user.mail
        }
        
        return jsonify(user_data)
    else:
        return 'user not found'
    

# ============================
# This function add user to db
# POST http://it-vesna-users-db-service-1:5100/users
# JSON request: {
#     "Surname": "Surname",
#     "Name": "Name",
#     "FathersName": "FathersName",
#     "Mail": "Mail@example.com",
#     "PasswordHash": "hash_value",
#     "PasswordSalt": "salt_value"
# }
@app.route('/users', methods=['POST'])
def add_user(): # TODO: Don`t add user if in bd existed same mail address
    data = request.json
    new_user = Users(surname=data['Surname'], name=data['Name'], fathersname=data['FathersName'], mail=data['Mail'])
    db.session.add(new_user)
    db.session.commit()

    new_password = Passwords(user_uid=new_user.uid, passwordhash=data['PasswordHash'], passwordsalt=data['PasswordSalt'])
    db.session.add(new_password)
    db.session.commit()

    return str(new_user.uid)


# ============================
# Update users data
# PUT http://it-vesna-users-db-service-1:5100/users/<int:user_id>
# JSON request: {
#     "Surname": "NewSurname",
#     "Name": "NewName",
#     "FathersName": "NewFathersName",
#     "Mail": "new_email@example.com"
# }
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get_or_404(user_id)
    data = request.json

    user.surname     = data['Surname']
    user.name        = data['Name']
    user.fathersname = data['FathersName']
    user.mail        = data['Mail']

    db.session.commit()
    return 'success'


# ============================
# Delete user
# DELETE http://it-vesna-users-db-service-1:5100/users/<int:user_id>
# No JSON request required for DELETE request
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get_or_404(user_id)
    password_entry = Passwords.query.filter_by(user_uid=user_id).first()
    if password_entry:
        db.session.delete(password_entry)

    db.session.delete(user)
    db.session.commit()
    return 'success'



# =============================================================
#   API for working with data about moderators from DB
# =============================================================

# ============================
# This function return all moderators from db
# GET http://it-vesna-users-db-service-1:5100/moderators
# No JSON request required for GET request
@app.route('/moderators', methods=['GET'])
def get_moderators():
    moderators = Moderators.query.all()
    result = []
    for moderator in moderators:
        user_data = {
            'UID': moderator.user_uid
        }
        
        result.append(user_data)
        
    return jsonify(result)


# ============================
# This function return moderator by ID from bd
# GET http://it-vesna-users-db-service-1:5100/moderators/<int:user_id>
# No JSON request required for GET request
@app.route('/moderators/<int:user_id>', methods=['GET'])
def get_moderator(user_id):
    moderator = Moderators.query.filter_by(uid=user_id).first()
    if moderator:
        user_data = {
            'UID': moderator.user_uid
        }
        
        return jsonify(user_data)
    else:
        return 'moderator not found'


# ============================
# Add moderator
# POST http://it-vesna-users-db-service-1:5100/moderators
# JSON request: {
#     "User_UID": user_id
# }
@app.route('/moderators', methods=['POST'])
def add_moderator():
    data = request.json
    moderator = Moderators(user_uid=data['User_UID'])
    
    db.session.add(moderator)
    db.session.commit()
    return 'success'


# ============================
# Delete moderator
# DELETE http://it-vesna-users-db-service-1:5100/moderators/<int:user_id>
# No JSON request required for DELETE request
@app.route('/moderators/<int:user_id>', methods=['DELETE'])
def delete_moderator(user_id):
    moderator = Moderators.query.filter_by(user_uid=user_id).first()
    if moderator:
        db.session.delete(moderator)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404



# =============================================================
#   API for getting data about notifications from DB
# =============================================================

# ============================
# This function return all notificated users from db
# GET http://it-vesna-users-db-service-1:5100/notifications
# No JSON request required for GET request
# RETURN: list of [ID - TYPE]
@app.route('/notifications', methods=['GET'])
def get_notificated():
    users = Notificated.query.all()
    result = []
    for user in users:
        user_data = {
            'UID': user.user_uid,
            'Type': user.notificationtype
        }
        
        result.append(user_data)
        
    return jsonify(result)


# ============================
# This function return all notificated users from db
# GET http://it-vesna-users-db-service-1:5100/notifications/<int:user_id>
# No JSON request required for GET request
# RETURN: notification
# {
#   'UID': 'User_UID',
#   'Type': 'NotificationType'
# }
@app.route('/notifications/<int:user_id>', methods=['GET'])
def get_notificated_user(user_id):
    notifications = Notificated.query.filter_by(user_uid=user_id).all()
    if notifications:
        for notification in notifications:
            notification_data = {
                'UID': notification.user_uid,
                'Type': notification.notificationtype
            }
            
            return notification_data
        
        return 0
    else:
        return 'not notify'


# ============================
# Add notification
# POST http://it-vesna-users-db-service-1:5100/nominations
# JSON request: {
#     "ID": "user_ID",
#     "type": "notification_type"
# }
@app.route('/notifications', methods=['POST'])
def add_notification():
    data = request.json
    notification = Notificated(user_uid=data["ID"], notificationtype=int(data["type"]))
    db.session.add(notification)
    db.session.commit()
    return 'success'


# ============================
# Delete notification
# DELETE http://it-vesna-users-db-service-1:5100/notifications/<int:user_id>
# No JSON request required for DELETE request
@app.route('/notifications/<int:user_id>', methods=['DELETE'])
def delete_notification(user_id):
    notification = Notificated.query.get(user_id)
    if notification:
        db.session.delete(notification)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404



# =============================================================
#   API for working with passwords data in DB
# =============================================================

# ============================
# Change password (Work only if user has previous password)
# PUT http://it-vesna-users-db-service-1:5100/passwords/<int:user_id>
# JSON request: {
#     "PasswordHash": "new_password_hash",
#     "PasswordSalt": "new_password_salt"
# }
@app.route('/passwords/<int:user_id>', methods=['PUT'])
def change_password(user_id):
    data = request.json
    user_password = Passwords.query.filter_by(user_uid=user_id).first()
    if user_password:
        user_password.passwordhash = data.get('PasswordHash')
        user_password.passwordsalt = data.get('PasswordSalt')
        db.session.commit()
        return 'success'
    else:
        return 'not success'


# ============================
# Get password by user_id
# PUT http://it-vesna-users-db-service-1:5100/passwords/<int:user_id>
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/passwords/<int:user_id>', methods=['GET'])
def get_password(user_id):
    data = request.json
    user_password = Passwords.query.filter_by(User_UID=user_id).first()
    if user_password:
        ret_data = {
            "hash": user_password.PasswordHash,
            "salt": user_password.PasswordSalt
        }

        return ret_data
    else:
        return 'not success'



# =============================================================
#   API for working with nominations data in DB
# =============================================================
# TODO Move nominations to another db service
# ============================
# Add nomination
# POST http://it-vesna-users-db-service-1:5100/nominations
# JSON request: {
#     "Name": "NominationName"
# }
@app.route('/nominations', methods=['POST'])
def add_nomination():
    data = request.json
    nomination = Nominations(name=data['Name'])
    db.session.add(nomination)
    db.session.commit()
    return 'success'


# ============================
# Delete nomination
# DELETE http://it-vesna-users-db-service-1:5100/nominations/<int:nomination_id>
# No JSON request required for DELETE request
@app.route('/nominations/<int:nomination_id>', methods=['DELETE'])
def delete_nomination(nomination_id):
    nomination = Nominations.query.get(nomination_id)
    if nomination:
        db.session.delete(nomination)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404
    


# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5100')