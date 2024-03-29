import requests


CRYPTO_SERVER = 'http://it-vesna-crypto-server-1:5300'


def crypto_str2hash(message, salt='none'):
    send_data = {
        "message": message,
        "salt": salt,
    }
    
    response = requests.post(f'{CRYPTO_SERVER}/str2hash', data=send_data)    
    return response['hash'], response['salt']
