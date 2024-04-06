import requests


DB_SERVER = 'http://it-vesna-users-db-service-1:27004'


def db_get_moders():
    return requests.get(f'{DB_SERVER}/moderators')

def db_get_moderator(user_id):
    return requests.get(f'{DB_SERVER}/moderators/{user_id}')

def db_add_moderator(user_id):
    data = {
        "User_UID": user_id
    }
    
    return requests.post(f'{DB_SERVER}/moderators', json=data, headers={'Content-Type': 'application/json'})

def db_delete_moderator(user_id):
    return requests.delete(f'{DB_SERVER}/moderators/{user_id}')