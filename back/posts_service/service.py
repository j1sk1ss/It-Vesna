# ==================
# Importing packages

from flask import Flask, request
from flask_cors import CORS


# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)