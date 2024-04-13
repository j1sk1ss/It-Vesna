import requests


SERVER = 'http://it-vesna-file-service-1:27013'


def file_put(file, path):
    requests.post(f'{SERVER}/file', json={
        "local_path"  : path  
    },
    files=file)
    
def file_get(path):
    return requests.get(f'{SERVER}/file/{path}')