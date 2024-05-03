import requests


API_URL = "http://it-vesna-api-service-1:5000/api"


#region [Moderators]
def get_moderators():
    moder_id = requests.get(f'{API_URL}/moderator').json
    moders = []
    for i in moder_id:
        data = {
            'ID': i['UID'],
            'Mail': 'none'
        }

        moders.append(requests.get(f'{API_URL}/user', json=data).json)

    return moders

def add_moderator(mail, name):
    data = {
        'ID': 'none',
        'Mail': mail
    }

    user = requests.get(f'{API_URL}/user', json=data).json
    if user['Name'] == name:
        data = {
            'user_id': user['UID']
        }

        return requests.post(f'{API_URL}/moderator', json=data)

    return 'failed'

# Note: Use get_user_by_mail
def delete_moderator(user_id):
    return requests.delete(f'{API_URL}/moderator/{user_id}')
#endregion