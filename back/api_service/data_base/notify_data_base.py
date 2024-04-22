import requests


DB_SERVER = 'http://it-vesna-users-db-service-1:5000'


def db_add_notify(user_id, type):
    send_data = {
        "ID": user_id,
        "type": type
    }
    
    return requests.post(f'{DB_SERVER}/notifications', json=send_data, headers={'Content-Type': 'application/json'})

def db_delete_notify(user_id):
    return requests.delete(f'{DB_SERVER}/notifications/{user_id}')

def db_is_notify(user_id):
    response = requests.get(f'{DB_SERVER}/notifications/{user_id}')
    if response.text == 'not notify':
        return {
            "UID": "null",
            "Type": "null"
        }
    
    return response

def get_notificated():
    return requests.get(f'{DB_SERVER}/notifications')