import requests


DB_SERVER = 'http://it-vesna-db-service-1:5100'


def db_get_moders():
    return requests.get(f'{DB_SERVER}/moderators')

def db_get_moderator(user_id):
    return requests.get(f'{DB_SERVER}/moderators/{user_id}')

def db_add_moderator(user_id):
    data = {
        "User_UID": user_id
    }
    
    return requests.post(f'{DB_SERVER}/moderators', data=data)

def db_delete_moderator(user_id):
    return requests.delete(f'{DB_SERVER}/moderators/{user_id}')