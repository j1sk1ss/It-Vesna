# ==================
# Importing packages

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy



# ==================
# Configuring server on starting

ALLOWED_IP = [
    'it-vesna-api-service-1'
]  

DB_NAME = "it-vesna-posts-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-posts-db-1:5601"

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER_NAME}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        return 'ip not allowed'