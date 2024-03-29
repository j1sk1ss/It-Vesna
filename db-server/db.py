# ==================
# Importing packages
# flask - main web server
# sqlalchemy - package for working with pgAdmin

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


# ==================
# Configuring server on starting

DB_NAME = "it-vesna-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-db-1:5432"


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER_NAME}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# ==================
# Setup SQL models

class Users(db.Model):
    UID = db.Column(db.Integer, primary_key=True)
    Surname = db.Column(db.String(255))
    Name = db.Column(db.String(255))
    FathersName = db.Column(db.String(255))
    Mail = db.Column(db.String(255))

class Admins(db.Model):
    User_UID = db.Column(db.Integer, db.ForeignKey('users.UID'), primary_key=True)

class Moderators(db.Model):
    User_UID = db.Column(db.Integer, db.ForeignKey('users.UID'), primary_key=True)

class Passwords(db.Model):
    User_UID = db.Column(db.Integer, db.ForeignKey('users.UID'), primary_key=True)
    PasswordHash = db.Column(db.String(255))
    PasswordSalt = db.Column(db.String(255))

class Nominations(db.Model):
    UID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))


# ==================
# Functions for working with bd
# Functions:
# Add user, delete user, get user by (name, mail)
# Add moderator, delete moderator
# Add nomination, delete nomination


@app.route('/api/alive', methods=['GET'])   # API link that listens by this handler
def alive_asnwer():
    return jsonify({'response': "I'm alive!"})


# ============================
# This function return all users from db
# GET /users
# No JSON request required for GET request
@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    result = []
    for user in users:
        user_data = {
            'UID': user.UID,
            'Surname': user.Surname,
            'Name': user.Name,
            'FathersName': user.FathersName,
            'Mail': user.Mail
        }
        result.append(user_data)
    return jsonify(result)


# ============================
# This function add user to db
# POST /users
# JSON request: {
#     "Surname": "Surname",
#     "Name": "Name",
#     "FathersName": "FathersName",
#     "Mail": "Mail@example.com",
#     "PasswordHash": "hash_value",
#     "PasswordSalt": "salt_value"
# }
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    new_user = Users(Surname=data['Surname'], Name=data['Name'], FathersName=data['FathersName'], Mail=data['Mail'])
    db.session.add(new_user)
    db.session.commit()

    # Создание записи в таблице Passwords для хранения пароля пользователя
    new_password = Passwords(User_UID=new_user.UID, PasswordHash=data['PasswordHash'], PasswordSalt=data['PasswordSalt'])
    db.session.add(new_password)
    db.session.commit()

    return 'success'


# ============================
# Update users data
# PUT /users/<int:user_id>
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
    user.Surname = data['Surname']
    user.Name = data['Name']
    user.FathersName = data['FathersName']
    user.Mail = data['Mail']
    db.session.commit()
    return 'success'


# ============================
# Delete user
# DELETE /users/<int:user_id>
# No JSON request required for DELETE request
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get_or_404(user_id)
    password_entry = Passwords.query.filter_by(User_UID=user_id).first()
    if password_entry:
        db.session.delete(password_entry)

    db.session.delete(user)
    db.session.commit()
    return 'success'


# ============================
# Change password
# PUT /passwords/<int:user_id>
# JSON request: {
#     "PasswordHash": "new_password_hash",
#     "PasswordSalt": "new_password_salt"
# }
@app.route('/passwords/<int:user_id>', methods=['PUT'])
def change_password(user_id):
    data = request.json
    user_password = Passwords.query.filter_by(User_UID=user_id).first()
    if user_password:
        user_password.PasswordHash = data.get('PasswordHash')
        user_password.PasswordSalt = data.get('PasswordSalt')
        db.session.commit()
        return 'success'
    else:
        return 'not success'


# ============================
# Add moderator
# POST /moderators
# JSON request: {
#     "User_UID": user_id
# }
@app.route('/moderators', methods=['POST'])
def add_moderator():
    data = request.json
    moderator = Moderators(User_UID=data['User_UID'])
    db.session.add(moderator)
    db.session.commit()
    return 'success'


# ============================
# Delete moderator
# DELETE /moderators/<int:user_id>
# No JSON request required for DELETE request
@app.route('/moderators/<int:user_id>', methods=['DELETE'])
def delete_moderator(user_id):
    moderator = Moderators.query.filter_by(User_UID=user_id).first()
    if moderator:
        db.session.delete(moderator)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404


# ============================
# Add nomination
# POST /nominations
# JSON request: {
#     "Name": "NominationName"
# }
@app.route('/nominations', methods=['POST'])
def add_nomination():
    data = request.json
    nomination = Nominations(Name=data['Name'])
    db.session.add(nomination)
    db.session.commit()
    return 'success'


# ============================
# Delete nomination
# DELETE /nominations/<int:nomination_id>
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


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5100')