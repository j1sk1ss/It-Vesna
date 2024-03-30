import requests


DB_SERVER = 'http://it-vesna-db-service-1:5100'


def db_add_notify(user_id, type):
    send_data = {
        "ID": user_id,
        "type": type
    }
    
    return requests.post(f'{DB_SERVER}/notifications', data=send_data)

def db_delete_notify(user_id):
    return requests.delete(f'{DB_SERVER}/notifications/{user_id}')

def db_is_notify(user_id):
    response = requests.get(f'{DB_SERVER}/notifications/{user_id}')
    if response == 'not notify':
        return False
    
    return True, response

def get_notificated():
    return requests.get(f'{DB_SERVER}/notifications')