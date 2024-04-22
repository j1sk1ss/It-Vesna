import requests


SERVER = 'http://it-vesna-users-db-service-1:5000'


def db_add_nomination(name):
    return requests.post(f'{SERVER}/nominations',
                         json={
                             "Name": name
                         }).text

def db_delete_nomination(nomination_id):
    return requests.delete(f'{SERVER}/nominations/{nomination_id}').text

def db_get_nominations():
    return requests.get(f'{SERVER}/nominations').text

def db_get_nomination(nomination_id):
    return requests.get(f'{SERVER}/nominations/{nomination_id}').text