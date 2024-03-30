from datetime import datetime, timedelta

import requests
import random
import string


API_URL = "http://it-vesna-api-service-1/api"


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

    return requests.post(f"{API_URL}/add_user", data=data)


def login(mail, password):
    data = {
        "mail": mail
    }

    user_response = requests.get(f"{API_URL}/user_by_mail", data=data)
    user_id = user_response['UID']

    data = {
        "ID": user_id
    }

    pass_response = requests.get(f"{API_URL}/get_pass", data=data)
    pass_hash, pass_salt = pass_response['hash'], pass_response['salt']

    data = {
        "data": password,
        "salt": pass_salt
    }

    save_pass_response = requests.get(f"{API_URL}/str2hash", data=data)
    save_pass_hash, _ = save_pass_response['hash'], save_pass_response['salt']

    return save_pass_hash == pass_hash


def restore_pass(mail):
    data = {
        "mail": mail
    }

    user_response = requests.get(f"{API_URL}/user_by_mail", data=data)
    user_id = user_response['UID']

    new_pass = get_random_string(15)
    data = {
        "ID": user_id,
        "password": new_pass
    }

    requests.post(f"{API_URL}/change_pass", data=data)

    data = {
        "destination": mail,
        "header": "Восстановление пароля",
        "text": new_pass,
        "type": "2"
    }

    requests.post(f"{API_URL}/send2mail", data=data)

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

    requests.post(f"{API_URL}/send2mail", data=data)
    codes.append( {
            "mail": mail,
            "code": code, # TODO: Maybe str2hash?
            "time": current_time
        }
    )


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