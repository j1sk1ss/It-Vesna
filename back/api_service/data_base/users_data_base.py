import requests


DB_SERVER = 'http://it-vesna-db-service-1:5100'


def db_add_user(surname, name, fname, mail, pass_hash, pass_salt):
    send_data = {
        "Surname": surname,
        "Name": name,
        "FathersName": fname,
        "Mail": mail,
        "PasswordHash": pass_hash,
        "PasswordSalt": pass_salt
    }

    return requests.post(f'{DB_SERVER}/users', json=send_data, headers={'Content-Type': 'application/json'})

def db_delete_user(user_id):
    return requests.delete(f'{DB_SERVER}/users/{user_id}')

def db_update_user(surname, name, fname, mail, user_id):
    send_data = {
        "Surname": surname,
        "Name": name,
        "FathersName": fname,
        "Mail": mail
    }
    
    return requests.put(f'{DB_SERVER}/users/{user_id}', json=send_data, headers={'Content-Type': 'application/json'})

def db_get_user_by_id(user_id):
    return requests.get(f'{DB_SERVER}/users/{user_id}')

def db_get_user_by_mail(mail):
    data = {
        "mail": mail
    }
    
    return requests.get(f'{DB_SERVER}/user_by_mail', json=data, headers={'Content-Type': 'application/json'})