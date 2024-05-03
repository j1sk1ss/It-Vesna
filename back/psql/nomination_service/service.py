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

DB_NAME = "it-vesna-nom-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "it_vesna_bd_pass"
DB_HOST = "it-vesna-nom-db-1:27011"


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER_NAME}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        print('[WARN] Ip address protection disabled')
        # abort(403)



# =============================================================
# Setup SQL models

class Nominations(db.Model):
    uid  = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))



# =============================================================
#   API for working with nominations data in DB
# =============================================================

# ============================
# Add nomination
# POST http://it-vesna-nom-db-service-1:27010/nominations
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
# DELETE http://it-vesna-nom-db-service-1:27010/nominations/<int:nomination_id>
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
    
# ============================
# This function return all nominations from db
# GET http://it-vesna-nom-db-service-1:27010/nominations
# No JSON request required for GET request
# RETURN: nom
# [{
#   'UID': 'nomination_id',
#   'Path': 'nomination_name'
# }, ... ]
@app.route('/nominations', methods=['GET'])
def get_nominations():
    nomination = Nominations.query.all()
    result = []
    for nomination_body in nomination:
        data = {
            'UID': nomination_body.user_uid,
            'Name': nomination_body.name,
        }
        
        result.append(data)
        
    return jsonify(result)


# ============================
# Get nomination by id
# GET http://it-vesna-nom-db-service-1:27010/nominations/<int:user_id>
# RETURN: "success"
@app.route('/nominations/<int:nom_id>', methods=['GET'])
def get_nomination(nom_id):
    nomination = Nominations.query.get(nom_id)
    if nomination:
        return {
            'UID': nomination.user_uid,
            'Name': nomination.name,
        }
    else:
        return 'not found', 404



# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')