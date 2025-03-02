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
UPLOAD_FOLDER = 'uploads' # DB (two dirs)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/<path:subpath>", methods=["GET"])
def dynamic_route(subpath: str):
    template_path = TEMPLATES.get("/" + subpath)
    if template_path:
        return render_template(template_path)
    
    abort(404)


@app.route("/api/register", methods=["POST"]) # DB
def _register() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    return "Registered", 200


@app.route("/api/login", methods=["POST"]) # DB
def _login() -> tuple:
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


@app.route("/api/requests", methods=["GET"]) # DB
def _get_requests() -> tuple:
    return {
        "На рассмотрении": [
            { 'id': 1, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example', 'github.com/example'], 'expanded': False },
            { 'id': 2, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example', 'github.com/example'], 'expanded': False },
            { 'id': 3, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 4, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
        ],
        "Принятые": [
            { 'id': 5, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 6, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 7, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 8, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
        ],
        "Архив": [
            { 'id': 9, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 10, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 11, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
            { 'id': 12, 'author': ['Иван Иванов'], 'email': 'ivan@example.com', 'nomination': 'Web', 'title': 'Разработка веб-приложения', 'description': 'Описание проекта...', 'consent': 'Согласен', 'links': ['github.com/example'], 'expanded': False },
        ]
    }, 200


@app.route("/api/request", methods=["DELETE"]) # DB
def _delete_request() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    req_id: int = data.get("id", -1)
    return "Deleted", 200


@app.route("/api/request", methods=["POST"])
def _create_request() -> tuple:
    project_name = request.form["project_name"]
    email = request.form["email"]
    nomination = request.form["nomination"]
    institution = request.form["institution"]
    age_group = request.form.get("age_group", "")
    authors = request.form.getlist("authors[]")
    links = request.form.getlist("links[]")
    description = request.files.get("description")
    consent_file = request.files.get("consent_file")
    file = request.files.get("file")

    consent_file_path = os.path.join(app.config['UPLOAD_FOLDER'], consent_file.filename)
    consent_file.save(consent_file_path)

    description_path = None
    if description:
        description_path = os.path.join(app.config['UPLOAD_FOLDER'], description.filename)
        description.save(description_path)

    file_path = None
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

    request_data = {
        "project_name": project_name,
        "email": email,
        "nomination": nomination,
        "institution": institution,
        "age_group": age_group,
        "authors": authors,
        "links": links,
        "description_path": description_path,
        "consent_file_path": consent_file_path,
        "file_path": file_path
    }

    return "Created", 201


@app.route("/api/request/set_category", methods=["POST"]) # DB
def _request_set_category() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    req_id: int = data.get("id", -1)
    category: str = data.get("category", "")

    return "Moved", 200


@app.route("/api/moderators", methods=["GET"]) # DB
def _get_moderators() -> tuple:
    return [{"name": "User", "email": "user@mail"}], 200


@app.route("/api/moderator", methods=["POST"]) # DB
def _add_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")
    return "Added", 200


@app.route("/api/moderator", methods=["DELETE"]) # DB
def _delete_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    email: str = data.get("email", "")
    return "Added", 200


@app.route("/api/nominations", methods=["GET"]) # DB
def _get_nominations() -> tuple:
    return ["Nomination"], 200


@app.route("/api/nomination", methods=["POST"]) # DB
def _add_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    return "Added", 200


@app.route("/api/nomination", methods=["DELETE"]) # DB
def _delete_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    return "Added", 200


@app.route("/api/age_groups", methods=["GET"]) # DB
def _get_age_groups() -> tuple:
    return ["Age group"], 200


@app.route("/api/age_group", methods=["POST"]) # DB
def _add_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    return "Added", 200


@app.route("/api/age_group", methods=["DELETE"]) # DB
def _delete_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    return "Added", 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    