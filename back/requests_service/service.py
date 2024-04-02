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

DB_NAME = "it-vesna-requests-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-requests-db-service-1:5701"


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

class Requests(db.Model):
    uid         = db.Column(db.Integer, primary_key=True)
    user_uid    = db.Column(db.Integer)
    name        = db.Column(db.String(255))
    requestpath = db.Column(db.String(255))
    
class Archive(db.Model):
    requestid = db.Column(db.Integer, db.ForeignKey('requests.uid'), primary_key=True)
    
class Approved(db.Model):
    requestid = db.Column(db.Integer, db.ForeignKey('requests.uid'), primary_key=True)



# =============================================================
#   API for working with requests data in DB
# =============================================================

# ============================
# Add request path
# POST http://it-vesna-requests-db-service-1:5700/requests
# JSON request: {
#     "ID": "user_id",
#     "Name": "request_name"
#     "Path": "request_path_on_local"
# }
# RETURN: "success"
@app.route('/requests', methods=['POST'])
def add_request():
    data = request.json
    requests_body = Requests(user_uid=data["ID"], name=data["Name"], requestpath=data["Path"])
    db.session.add(requests_body)
    db.session.commit()
    return 'success'


# ============================
# Delete request path
# DELETE http://it-vesna-requests-db-service-1:5700/requests/<int:user_id>
# RETURN: "success"
@app.route('/requests/<int:user_id>', methods=['DELETE'])
def delete_request(user_id):
    request_body = Requests.query.filter_by(user_uid=user_id).first()
    if request_body:
        db.session.delete(request_body)
        db.session.commit()
        return 'success'
    else:
        return 'not found', 404


# ============================
# This function return all requests from users from db
# GET http://it-vesna-requests-db-service-1:5700/requests
# No JSON request required for GET request
# RETURN: requests
# [{
#   'UID': 'User_UID',
#   'Path': 'Path_to_request_on_local'
# }, ... ]
@app.route('/requests', methods=['GET'])
def get_requests():
    requests = Requests.query.all()
    result = []
    for request_body in requests:
        data = {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.requestpath
        }
        
        result.append(data)
        
    return jsonify(result)


# ============================
# Get request by user_id
# GET http://it-vesna-requests-db-service-1:5700/requests/user/<int:user_id>
# RETURN: "success"
@app.route('/requests/user/<int:user_id>', methods=['GET'])
def get_request_by_user_id(user_id):
    request_body = Requests.query.filter_by(user_uid=user_id).first()
    if request_body:
        return {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.requestpath
        }
    else:
        return 'not found', 404


# ============================
# Get request by user_id
# GET http://it-vesna-requests-db-service-1:5700/requests/<int:request_id>
# RETURN: "success"
@app.route('/requests/<int:request_id>', methods=['GET'])
def get_request_by_request_id(request_id):
    request_body = Requests.query.get(request_id)
    if request_body:
        return {
            'UID': request_body.user_uid,
            'Name': request_body.name,
            'Path': request_body.requestpath
        }
    else:
        return 'not found', 404



# =============================================================
#   API for working with archive data in DB
# =============================================================

# ============================
# Add request to archive
# POST http://it-vesna-requests-db-service-1:5700/archive
# JSON request: {
#     "ID": "request id"
# }
# RETURN: "success"
@app.route('/archive', methods=['POST'])
def add_request2archive():
    data = request.json
    archive_body = Archive(requestid=data["ID"])
    db.session.add(archive_body)
    db.session.commit()
    return 'success'


# ============================
# Delete request from archive
# DELETE http://it-vesna-requests-db-service-1:5700/archive/<int:request_id>
# RETURN: "success"
@app.route('/archive/<int:request_id>', methods=['DELETE'])
def delete_request_from_archive(request_id):
    archive_body = Archive.query.get(request_id)
    if archive_body:
        db.session.delete(archive_body)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404


# ============================
# This function return all archive from users from db
# GET http://it-vesna-requests-db-service-1:5700/archive
# No JSON request required for GET request
# RETURN: requests
# [{
#   'UID': 'request_id',
# }, ... ]
@app.route('/archive', methods=['GET'])
def get_arcives():
    archives = Archive.query.all()
    result = []
    for archive_body in archives:
        data = {
            'UID': archive_body.requestid
        }
        
        result.append(data)
        
    return jsonify(result)



# =============================================================
#   API for working with approved data in DB
# =============================================================

# ============================
# Add request to approved
# POST http://it-vesna-requests-db-service-1:5700/approved
# JSON request: {
#     "ID": "request id"
# }
# RETURN: "success"
@app.route('/approved', methods=['POST'])
def add_request2approved():
    data = request.json
    archive_body = Approved(requestid=data["ID"])
    db.session.add(archive_body)
    db.session.commit()
    return 'success'


# ============================
# Delete request from approved
# DELETE http://it-vesna-requests-db-service-1:5700/approved/<int:request_id>
# RETURN: "success" / "not success"
@app.route('/approved/<int:request_id>', methods=['DELETE'])
def delete_request_from_approved(request_id):
    archive_body = Approved.query.get(request_id)
    if archive_body:
        db.session.delete(archive_body)
        db.session.commit()
        return 'success'
    else:
        return 'not success', 404


# ============================
# This function return all approved from users from db
# GET http://it-vesna-requests-db-service-1:5700/approved
# No JSON request required for GET request
# RETURN: requests
# [{
#   'UID': 'request_id',
# }, ... ]
@app.route('/approved', methods=['GET'])
def get_approved():
    archives = Approved.query.all()
    result = []
    for archive_body in archives:
        data = {
            'UID': archive_body.requestid
        }
        
        result.append(data)
        
    return jsonify(result)



# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5700')