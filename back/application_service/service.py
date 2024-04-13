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

DB_NAME = "it-vesna-application-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-application-db-1:27009"


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

class Applications(db.Model):
    uid             = db.Column(db.Integer, primary_key=True)
    user_uid        = db.Column(db.Integer)
    name            = db.Column(db.String(255))
    applicationpath = db.Column(db.String(255))
    
class Archive(db.Model):
    applicationid = db.Column(db.Integer, db.ForeignKey('applications.uid'), primary_key=True)
    
class Approved(db.Model):
    applicationid = db.Column(db.Integer, db.ForeignKey('applications.uid'), primary_key=True)



# =============================================================
#   API for working with applications data in DB
# =============================================================

# ============================
# Add application path
# POST http://it-vesna-application-db-service-1:27008/applications
# JSON request: {
#     "ID": "user_id",
#     "Name": "request_name"
#     "Path": "request_path_on_local"
# }
# RETURN: "success"
@app.route('/applications', methods=['POST'])
def add_application():
    data = request.json
    requests_body = Applications(user_uid=data["ID"], name=data["Name"], applicationpath=data["Path"])
    db.session.add(requests_body)
    db.session.commit()
    return 'success'


# ============================
# Delete application path
# DELETE http://it-vesna-application-db-service-1:27008/applications/<int:user_id>
# RETURN: "success"
@app.route('/applications/<int:user_id>', methods=['DELETE'])
def delete_application(user_id):
    request_body = Applications.query.filter_by(user_uid=user_id).first()
    if request_body:
        db.session.delete(request_body)
        db.session.commit()
        return 'success'
    else:
        return 'not found', 404


# ============================
# This function return all applications from users from db
# GET http://it-vesna-application-db-service-1:27008/applications
# No JSON request required for GET application
# RETURN: applications
# [{
#   'UID': 'User_UID',
#   'Path': 'Path_to_request_on_local'
# }, ... ]
@app.route('/applications', methods=['GET'])
def get_applications():
    applications = Applications.query.all()
    result = []
    for request_body in applications:
        data = {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.applicationpath
        }
        
        result.append(data)
        
    return jsonify(result)


# ============================
# Get application by user_id
# GET http://it-vesna-application-db-service-1:27008/applications/user/<int:user_id>
# RETURN: "success"
@app.route('/applications/user/<int:user_id>', methods=['GET'])
def get_application_by_user_id(user_id):
    request_body = Applications.query.filter_by(user_uid=user_id).first()
    if request_body:
        return {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.applicationpath
        }
    else:
        return 'not found', 404


# ============================
# Get application by user_id
# GET http://it-vesna-application-db-service-1:27008/applications/<int:application_id>
# RETURN: "success"
@app.route('/applications/<int:application_id>', methods=['GET'])
def get_application_by_request_id(application_id):
    request_body = Applications.query.get(application_id)
    if request_body:
        return {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.applicationpath
        }
    else:
        return 'not found', 404



# =============================================================
#   API for working with archive data in DB
# =============================================================

# ============================
# Add application to archive
# POST http://it-vesna-application-db-service-1:27008/archive
# JSON application: {
#     "ID": "application id"
# }
# RETURN: "success"
@app.route('/archive', methods=['POST'])
def add_application2archive():
    data = request.json
    archive_body = Archive(applicationid=data["ID"])
    db.session.add(archive_body)
    db.session.commit()
    return 'success'


# ============================
# Delete application from archive
# DELETE http://it-vesna-application-db-service-1:27008/archive/<int:applicationid>
# RETURN: "success"
@app.route('/archive/<int:application_id>', methods=['DELETE'])
def delete_application_from_archive(application_id):
    archive_body = Archive.query.get(application_id)
    if archive_body:
        db.session.delete(archive_body)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404


# ============================
# This function return all archive from users from db
# GET http://it-vesna-application-db-service-1:27008/archive
# No JSON request required for GET application
# RETURN: application
# [{
#   'UID': 'applicationid',
# }, ... ]
@app.route('/archive', methods=['GET'])
def get_arcives():
    archives = Archive.query.all()
    result = []
    for archive_body in archives:
        data = {
            'UID': archive_body.applicationid
        }
        
        result.append(data)
        
    return jsonify(result)



# =============================================================
#   API for working with approved data in DB
# =============================================================

# ============================
# Add application to approved
# POST http://it-vesna-application-db-service-1:27008/approved
# JSON application: {
#     "ID": "application id"
# }
# RETURN: "success"
@app.route('/approved', methods=['POST'])
def add_application2approved():
    data = request.json
    archive_body = Approved(applicationid=data["ID"])
    db.session.add(archive_body)
    db.session.commit()
    return 'success'


# ============================
# Delete application from approved
# DELETE http://it-vesna-application-db-service-1:27008/approved/<int:application_id>
# RETURN: "success" / "not success"
@app.route('/approved/<int:application_id>', methods=['DELETE'])
def delete_application_from_approved(application_id):
    archive_body = Approved.query.get(application_id)
    if archive_body:
        db.session.delete(archive_body)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404


# ============================
# This function return all approved from users from db
# GET http://it-vesna-application-db-service-1:27008/approved
# No JSON request required for GET application
# RETURN: applications
# [{
#   'UID': 'request_id',
# }, ... ]
@app.route('/approved', methods=['GET'])
def get_approved():
    archives = Approved.query.all()
    result = []
    for archive_body in archives:
        data = {
            'UID': archive_body.applicationid
        }
        
        result.append(data)
        
    return jsonify(result)



# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')