import requests


CRYPTO_SERVER = 'http://it-vesna-crypto-service-1:5300'


def crypto_str2hash(message, salt='none'):
    send_data = {
        "message": message,
        "salt": salt,
    }
    
    response = requests.post(f'{CRYPTO_SERVER}/str2hash', json=send_data, headers={'Content-Type': 'application/json'})    
    if response.status_code == 200:
        data = response.json()
        return data['hash'], data['salt']
    else:
        return None, None
