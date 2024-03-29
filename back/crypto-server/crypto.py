# ==================
# Importing packages

from flask import Flask, request, jsonify
from flask_cors import CORS

import string
import bcrypt


# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)


# ==================
# Handlers

# ==================
# Converts string to hash with salt
# string - string for converting
# return: hash, salt
# POST http://it-vesna-crypto-server-1:5300/str2hash
# JSON request: {
#     "message": "message",
#     "salt": "salt or none"
# }
# RETURN:
# JSON response: {
#     "hash": "hash",
#     "salt": "salt"
# }
@app.route('/str2hash', methods=['POST'])
def string2hash():
    data = request.json
    
    salt = bcrypt.gensalt()
    if data['salt'] != "none":
        salt = data['salt']
    
    hash = bcrypt.hashpw(data['message'].encode('utf-8'), salt=salt)
    
    return_data = {
        "hash": hash,
        "salt": salt
    }
    
    return return_data


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5300')