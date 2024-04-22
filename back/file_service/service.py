# Note: Files should be stored at workdir/data/...
#       That's mean, that if you want to store, you should use path: data/... 
# ==================
# Importing packages

import os
from flask import Flask, request, send_file
from werkzeug.utils import secure_filename


# ==================
# Setup service

app = Flask(__name__)

ALLOWED_IP = [
    'it-vesna-api-service-1'
]  

@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        print('[WARN] Ip address protection disabled')
        # abort(403)


# ==================
# Save transfered file
# POST http://it-vesna-file-service-1:27013/file
# JSON request: {
#     "local_path": "load_path"
# }
# RETURN: "no file" / file path
@app.route('/file', methods=['POST'])
def put_file():
    if 'file' not in request.files:
        return 'no file'
    
    file = request.files['file']
    if file.filename == '':
        return 'no file'
    
    filename = secure_filename(file.filename)
    
    path = request.json['local_path']
    file.save(os.path.join(path, filename))    
    return path
 
 
# ==================
# Load file from server
# GET http://it-vesna-file-service-1:27013/file/<path:filename>
# RETURN: file
@app.route('/file/<path:filename>', methods=['GET'])
def get_file(filename): 
    return send_file(filename, as_attachment=True)


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')