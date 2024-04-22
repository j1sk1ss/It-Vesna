import requests


SERVER = 'http://it-vesna-application-db-service-1:5000'


def db_add_application(user_id, name, path):
    return requests.post(f'{SERVER}/applications',
                  json={
                      "ID": user_id,
                      "Name": name,
                      "Path": path
                  }).text

def db_delete_application(user_id):
    return requests.delete(f'{SERVER}/applications/{user_id}').text

def db_get_applications():
    return requests.get(f'{SERVER}/applications').text

def db_get_application(user_id = -1, application_id = -1):
    if user_id != -1:
        return requests.get(f'{SERVER}/applications/user/{user_id}').text
    elif application_id != -1:
        return requests.get(f'{SERVER}/applications/{application_id}').text
    
    return 'error'

def db_application2archive(application_id):
    return requests.post(f'{SERVER}/archive',
                         json={
                             "ID": application_id
                         })

def db_delete_application_in_archive(application_id):
    return requests.delete(f'{SERVER}/archive/{application_id}').text

def db_get_archives():
    return requests.get(f'{SERVER}/archive').text

def db_application2approved(application_id):
    return requests.post(f'{SERVER}/approved',
                         json={
                             "ID": application_id
                         }).text

def db_delete_application_in_approved(application_id):
    return requests.delete(f'{SERVER}/approved/{application_id}').text

def db_get_approved():
    return requests.get(f'{SERVER}/approved').text
