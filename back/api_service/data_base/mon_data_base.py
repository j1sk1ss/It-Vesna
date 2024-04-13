import requests


SERVER = 'http://it-vesna-users-db-service-1:27010'


def add_nomination(name):
    return requests.post(f'{SERVER}/nominations',
                         json={
                             "Name": name
                         })

def delete_nomination(nomination_id):
    return requests.delete(f'{SERVER}/nominations/{nomination_id}')

def get_nominations():
    return requests.get(f'{SERVER}/nominations')

def get_nomination(nomination_id):
    return requests.get(f'{SERVER}/nominations/{nomination_id}')