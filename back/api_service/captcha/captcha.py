import requests
import json


CAPTCHA_SECRET = "" # TODO: Move secret key to files
# TODO: Maybe another service?


# Connect with captcha services and check answer
# captcha_response - data what was given from captcha app on site
# return: True or false
def captcha_check(captcha_response):
    payload = {
        'response' : captcha_response, 
        'secret':  CAPTCHA_SECRET
    }
    
    response = requests.post("https://www.google.com/recaptcha/api/siteverify", json=payload, headers={'Content-Type': 'application/json'})
    return json.loads(response.text)['success']