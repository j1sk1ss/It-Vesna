import requests


DB_SERVER = 'http://it-vesna-db-server-1:5100'


def db_change_password(pass_hash, pass_salt, user_id):
    send_data = {
        "PasswordHash": pass_hash,
        "PasswordSalt": pass_salt
    }    
    
    return requests.put(f'{DB_SERVER}/passwords/{user_id}', json=send_data)