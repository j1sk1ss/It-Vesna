# ==================
# Importing packages
# flask - main web server
# sqlalchemy - package for working with pgAdmin

from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SERVER_MAIL = "cordell.confirm@gmail.com" # TODO: Move constants to files
SERVER_MAIL_PASS = "zqcn eljx qjjj ekpu"
SMTP_SERVER = "smtp.gmail.com"


# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)


# ==================
# Send data to destination
# POST /send_mail
# JSON request: {
#     "destination": "destination_mail",
#     "header": "mail_header",
#     "text": "mail_text"
# }
@app.route('/send_mail', methods=['POST'])
def send_mail():
    data = request.json
    
    message = MIMEMultipart()
    
    message["From"] = SERVER_MAIL
    message["To"] = data["destination"]
    message["Subject"] = data["header"]
    
    message.attach(MIMEText(data["text"], "plain"))
    
    with smtplib.SMTP(SMTP_SERVER, 587) as server:
        server.starttls()
        server.login(SERVER_MAIL, SERVER_MAIL_PASS)
        server.sendmail(SERVER_MAIL, data["destination"], message.as_string())
        
        
# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5200')