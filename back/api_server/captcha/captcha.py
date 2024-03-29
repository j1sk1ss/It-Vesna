import requests
import json


CAPTCHA_SECRET = "" # TODO: Move secret key to files


# Connect with captcha services and check answer
# captcha_response - data what was given from captcha app on site
# return: True or false
def captcha_check(captcha_response):
    payload = {
        'response' : captcha_response, 
        'secret':  CAPTCHA_SECRET
    }
    
    response = requests.post("https://www.google.com/recaptcha/api/siteverify", payload)
    return json.loads(response.text)['success']