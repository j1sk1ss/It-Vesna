import os

from flask import jsonify, request
from back.common.auth import verify_access_key


def find_templates(template: str) -> dict:
    routes: dict = {}
    for root, _, files in os.walk(template):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), template)
                route = "/" + rel_path.replace("\\", "/").replace(".html", "")
                routes[route] = rel_path.replace("\\", "/")

    return routes


def require_authorization(f):
    def wrapper(*args, **kwargs):
        auth_key = request.headers.get("Authorization")
        if not verify_access_key(auth_key):
            return jsonify({"error": "Unauthorized"}), 403
        
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper
