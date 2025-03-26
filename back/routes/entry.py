from flask import current_app as app
from flask import request
from back.common.auth import _get_hash, generate_access_key

from back.models import *


@app.route("/api/register", methods=["POST"])
def _register() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    try:
        create_user(name=name, email=email, password=_get_hash(password))
        return "Registered", 201
    except Exception as ex:
        print(ex)
        return "Error", 500     # Уточнить исключение


@app.route("/api/login", methods=["POST"])
def _login() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    user = get_user_by_email(email=email)
    if user:
        if user.password == _get_hash(password):
            moderator = get_moderators_by_user(user_id=user.id)[-1]
            if moderator:
                return {
                    "status": "status",
                    "role": "admin",
                    "name": user.name,
                    "key": generate_access_key(email, password)
                }, 200
            else:
                return {
                    "status": "status",
                    "role": "user"
                }, 200
        else:
            return "Pass wrong", 401
    else:
        return "Email wrong", 401


@app.route("/api/send_code", methods=["POST"])
def _send_restore_code() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    email: str = data.get("email", "")
    return "Code sent", 200


@app.route("/api/confirm_code", methods=["POST"])
def _confirm_restore_code() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    code: str = data.get("code", "")
    return "Code confirm", 200
