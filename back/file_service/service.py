# ==================
# Importing packages

import os
from flask import Flask, request, send_file
from werkzeug.utils import secure_filename


# ==================
# Setup service

app = Flask(__name__)


# ==================
# Save transfered file
# POST http://it-vesna-file-service-1:5500/file
# JSON request: {
#     "local_path": "load_path"
# }
# RETURN: "no file" / file path
@app.route('/file', methods=['POST'])
def upload_file():
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
# GET http://it-vesna-file-service-1:5500/file/<path:filename>
# RETURN: file
@app.route('/file/<path:filename>', methods=['GET'])
def upload_file(filename): 
    return send_file(filename, as_attachment=True)


# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5500')