from datetime import datetime, timedelta

import requests
import random
import string


API_URL = "http://it-vesna-api-service-1:5000/api"


def register(name, surname, father_name, mail, password):
    if not password_confirm(password=password):
        return "weak pass"

    data = {
        "surname": surname,
        "name": name,
        "father_name": father_name,
        "mail": mail,
        "password": password
    }

    requests.post(f"{API_URL}/user", json=data, headers={'Content-Type': 'application/json'})

    return 'registered'


def login(mail, password):

    # ========================
    # Get user from bd by mail

    data = {
        "ID": "none",
        "Mail": mail
    }

    user_response = requests.get(f"{API_URL}/user", json=data, headers={'Content-Type': 'application/json'})
    user_id = user_response.json()['UID']

    # ========================
    # Get user pass hash and pass salt

    pass_response = requests.get(f"{API_URL}/password/{user_id}")

    pass_hash, pass_salt = 0, 0
    if pass_response.status_code == 200:
        response = pass_response.json()
        pass_hash, pass_salt = response['hash'], response['salt']

    # ========================
    # Hash entered pass and check

    data = {
        "data": password,
        "salt": pass_salt
    }

    save_pass_response = requests.post(f"{API_URL}/str2hash", json=data, headers={'Content-Type': 'application/json'})

    save_pass_hash = 0
    if save_pass_response.status_code == 200:
        response = save_pass_response.json()
        save_pass_hash, _ = response['hash'], response['salt']
    
    # ========================
    # Check moderator status
    
    if save_pass_hash == pass_hash:
        moder_response = requests.get(f"{API_URL}/moderator/{user_id}")
        if moder_response.text == "moderator not found":
            return {
                "status": "logged",
                "role": "user"
            }
        else:
            return {
                "status": "logged",
                "role": "moderator"
            }
    
    return {
            "status": "error",
            "role": "none"
        }
        


def restore_pass(mail):

    # ========================
    # Get user from bd by mail

    data = {
        "ID": "none",
        "Mail": mail
    }

    user_response = requests.get(f"{API_URL}/user", json=data, headers={'Content-Type': 'application/json'})
    user_id = user_response.json()['UID']

    # ========================
    # Generate new password and change old password

    new_pass = get_random_string(15)
    data = {
        "ID": user_id,
        "password": new_pass
    }

    requests.put(f"{API_URL}/password", json=data, headers={'Content-Type': 'application/json'})

    # ========================
    # Send new password to user's mail

    data = {
        "destination": mail,
        "header": "Восстановление пароля",
        "text": new_pass,
        "type": "2"
    }

    requests.post(f"{API_URL}/send_mail", json=data, headers={'Content-Type': 'application/json'})

    return 0


codes = []

def send_verify_code(mail):
    code = get_random_string(10)

    data = {
        "destination": mail,
        "header": "Код подтверждения почты",
        "text": code,
        "type": "1"
    }

    now = datetime.now() + timedelta(minutes = 1)
    current_time = now.strftime("%H:%M:%S")

    requests.post(f"{API_URL}/send_mail", json=data, headers={'Content-Type': 'application/json'})
    codes.append( {
            "mail": mail,
            "code": code,
            "time": current_time
        }
    )

    now = datetime.now()
    for i in range(len(codes)):
        code_time = datetime.strptime(codes[i]["time"], "%H:%M:%S")
        if now < code_time:
            del codes[i]


def verify_mail(mail, code):
    for i in range(len(codes)):
        if codes[i]["mail"] == mail and codes[i]["code"] == code:
            now = datetime.now()
            code_time = datetime.strptime(codes[i]["time"], "%H:%M:%S")

            del codes[i]
            if now < code_time:
                return False
            
            return True

    return False


def password_confirm(password: str):
    if len(password) < 8:
        return False

    if not any(char.islower() for char in password):
        return False

    if not any(char.isupper() for char in password):
        return False

    if not any(char.isdigit() for char in password):
        return False

    return True


def get_random_string(length: int):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    
    return result_str