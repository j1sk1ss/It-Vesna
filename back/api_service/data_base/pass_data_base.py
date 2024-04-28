import requests


DB_SERVER = 'http://it-vesna-users-db-service-1:5000'


def db_change_password(pass_hash, pass_salt, user_id):
    send_data = {
        "PasswordHash": pass_hash,
        "PasswordSalt": pass_salt
    }    
    
    return requests.put(f'{DB_SERVER}/passwords/{user_id}', json=send_data, headers={'Content-Type': 'application/json'}).text

def db_get_password(user_id):
    return requests.get(f'{DB_SERVER}/passwords/{user_id}')