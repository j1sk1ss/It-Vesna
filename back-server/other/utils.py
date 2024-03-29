import random
import string
import re


# Return random string
# length - length of requested random string
def get_random_string(length: int):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    
    return result_str


# Check strong password
# password - password for checking
# return: Password strong or not
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