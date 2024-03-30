import requests


MAIL_SERVER = 'http://it-vesna-mail-service-1:5200'


def ml_send_mail(destination, header, text, type):
    send_data = {
        "destination": destination,
        "header": header,
        "text": text,
        "type": type
    }
    
    return requests.post(f'{MAIL_SERVER}/send_mail', data=send_data)
