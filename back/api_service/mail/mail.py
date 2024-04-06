import requests


MAIL_SERVER = 'http://it-vesna-mail-service-1:27002'


def ml_send_mail(destination, header, text, type):
    send_data = {
        "destination": destination,
        "header": header,
        "text": text,
        "type": type
    }
    
    return requests.post(f'{MAIL_SERVER}/send_mail', json=send_data, headers={'Content-Type': 'application/json'})
