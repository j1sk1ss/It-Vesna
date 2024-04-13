import requests


SERVER = 'http://it-vesna-requests-db-service-1:27008'


def add_request(user_id, name, path):
    return requests.post(f'{SERVER}/requests',
                  json={
                      "ID": user_id,
                      "Name": name,
                      "Path": path
                  })

def delete_request(user_id):
    return requests.delete(f'{SERVER}/requests/{user_id}')

def get_requests():
    return requests.get(f'{SERVER}/requests')

def get_request(user_id = -1, request_id = -1):
    if user_id != -1:
        return requests.get(f'{SERVER}/requests/user/{user_id}')
    elif request_id != -1:
        return requests.get(f'{SERVER}/requests/{request_id}')
    
    return 'error'

def request2archive(request_id):
    return requests.post(f'{SERVER}/archive',
                         json={
                             "ID": request_id
                         })

def delete_request_in_archive(request_id):
    return requests.delete(f'{SERVER}/archive/{request_id}')

def get_archives():
    return requests.get(f'{SERVER}/archive')

def request2approved(request_id):
    return requests.post(f'{SERVER}/approved',
                         json={
                             "ID": request_id
                         })

def delete_request_in_approved(request_id):
    return requests.delete(f'{SERVER}/approved/{request_id}')

def get_approved():
    return requests.get(f'{SERVER}/approved')
