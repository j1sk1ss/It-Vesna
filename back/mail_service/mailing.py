# Mail service needs for working with SMPT library
# On this site it needs for sending codes, notificatons and info to user

# ==================
# Importing packages

from flask import Flask, request
from flask_cors import CORS
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage


SERVER_MAIL = "cordell.confirm@gmail.com" # TODO: Move constants to files
SERVER_MAIL_PASS = "zqcn eljx qjjj ekpu"
SMTP_SERVER = "smtp.gmail.com"


# ==================
# Configuring server on starting

app = Flask(__name__)
CORS(app)


IMAGES = [] # TODO: Load images from disk (Paths to images)


# ==================
# Send data to destination
# POST /send_mail
# JSON request: {
#     "destination": "destination_mail",
#     "header": "mail_header",
#     "text": "mail_text"
#     "type": "message_type" (0 - default, 1 - ...)
# }
@app.route('/send_mail', methods=['POST'])
def send_mail():
    data = request.json
    
    message = MIMEMultipart()
    
    message["From"] = SERVER_MAIL
    message["To"] = data["destination"]
    message["Subject"] = data["header"]
    

    html = f"""
    <html>
      <body>
        <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>  
            <td valign="middle" align="center" background="cid:image1">
              <div style="text-align: center; color: white;">
                <p>{data["text"]}</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
    
    message.attach(MIMEText(html, "html"))
    
    with open(IMAGES[int(data['type'])], "rb") as image_file:
        image = MIMEImage(image_file.read())
        image.add_header('Content-ID', '<image1>')
        message.attach(image)
    
    with smtplib.SMTP(SMTP_SERVER, 587) as server:
        server.starttls()
        server.login(SERVER_MAIL, SERVER_MAIL_PASS)
        server.sendmail(SERVER_MAIL, data["destination"], message.as_string())
        
        
# ==================
# Start server with static ip
app.run(host='0.0.0.0', port='5200')