import os
from flask import Flask, render_template, abort, request
from flask_cors import CORS


def _find_templates() -> dict:
    routes: dict = {}
    for root, _, files in os.walk(app.template_folder):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), app.template_folder)
                route = "/" + rel_path.replace("\\", "/").replace(".html", "")
                routes[route] = rel_path.replace("\\", "/")
    return routes


app: Flask = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app=app)
TEMPLATES = _find_templates()


@app.route("/<path:subpath>", methods=["GET"])
def dynamic_route(subpath: str):
    template_path = TEMPLATES.get("/" + subpath)
    if template_path:
        return render_template(template_path)
    
    abort(404)


@app.route("/api/register", methods=["POST"])
def _register() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    return "Registered", 200


@app.route("/api/login", methods=["POST"])
def _login() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    return {
        "status": "status",
        "role": "admin",
        "key": "generated"
    }, 200


@app.route("/api/send_code", methods=["POST"])
def _send_restore_code() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    email: str = data.get("email", "")
    return "Code sent", 200


@app.route("/api/confirm_code", methods=["POST"])
def _confirm_restore_code() -> dict:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    code: str = data.get("code", "")
    return "Code confirm", 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    