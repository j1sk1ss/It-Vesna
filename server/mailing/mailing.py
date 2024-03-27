import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SERVER_MAIL = "cordell.confirm@gmail.com" # TODO: Move constants to files
SERVER_MAIL_PASS = "zqcn eljx qjjj ekpu"
SMTP_SERVER = "smtp.gmail.com"


# Send data to destination
# destination_mail - mail that will receive data
# data - sending data
# header - header of the mail
def send_mail(destination_mail: str, data: str, header: str):
    message = MIMEMultipart()
    
    message["From"] = SERVER_MAIL
    message["To"] = destination_mail
    message["Subject"] = header
    
    message.attach(MIMEText(data, "plain"))
    
    with smtplib.SMTP(SMTP_SERVER, 587) as server:
        server.starttls()
        server.login(SERVER_MAIL, SERVER_MAIL_PASS)
        server.sendmail(SERVER_MAIL, destination_mail, message.as_string())