import os

from flask import current_app as app
from datetime import datetime
from werkzeug.utils import secure_filename
from common.misc import find_templates
from flask import jsonify, render_template, abort, request

from models import *

    
TEMPLATES = find_templates('templates')
UPLOAD_FOLDER = 'statis/uploads'


# region [Routes]

@app.route("/<path:subpath>", methods=["GET"])
def dynamic_route(subpath: str):
    template_path = TEMPLATES.get("/" + subpath)
    if template_path:
        return render_template(template_path)
    
    abort(404)


@app.route("/api/register", methods=["POST"])
def _register() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    try:
        create_user(name=name, email=email, password=password)
        return "Registered", 200
    except Exception as ex:
        print(ex)
        return "Error", 500


@app.route("/api/login", methods=["POST"])
def _login() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    email: str = data.get("email", "")
    password: str = data.get("password", "")

    user = get_user_by_email(email=email)
    if user:
        if user.password == password:
            moderator = get_moderators_by_user(user_id=user.id)[-1]
            if moderator:
                return {
                    "status": "status",
                    "role": "admin",
                    "key": "generated"
                }, 200
            else:
                return {
                    "status": "status",
                    "role": "user",
                    "key": "generated"
                }, 200
        else:
            return "Pass wrong", 400
    else:
        return "Email wrong", 400


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


@app.route("/api/requests", methods=["GET"])
def _get_requests() -> tuple:
    category = request.args.get('category', None)
    requests = get_all_requests()

    if category:
        requests = [req for req in requests if req.category == category]
    
    if requests:
        response = {
            "На рассмотрении": [],
            "Принятые": [],
            "Архив": []
        }

        for req in requests:
            if req.category == "Принятые":
                response["Принятые"].append(req.parse_request())
            elif req.category == "На рассмотрении":
                response["На рассмотрении"].append(req.parse_request())
            elif req.category == "Архив":
                response["Архив"].append(req.parse_request())

        return response, 200
    else:
        return "No requests", 404


@app.route("/api/request", methods=["DELETE"])
def _delete_request() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    req_id: int = data.get("id", -1)
    delete_request(request_id=req_id)
    return "Deleted", 200


@app.route("/api/request", methods=["POST"])
def _create_request() -> tuple:
    project_name = request.form.get("project_name", "")
    email = request.form.get("email", "")
    nomination = request.form.get("nomination", "")
    institution = request.form.get("institution", "")
    age_group = request.form.get("age_group", "")
    authors = request.form.getlist("authors[]")
    links = request.form.getlist("links[]")
    description = request.files.get("description")
    consent_file = request.files.get("consent_file")
    file = request.files.get("file")

    consent_file_path = os.path.join(UPLOAD_FOLDER, consent_file.filename)
    consent_file.save(consent_file_path)

    description_path = None
    if description:
        description_path = os.path.join(UPLOAD_FOLDER, description.filename)
        description.save(description_path)

    file_path = None
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

    author = get_user_by_email(email=email)
    if not author:
        return "No author", 400
    
    nomination = get_nomination_by_name(nomination_name=nomination)
    if not nomination:
        return "No nomination", 400

    age_group = get_age_group_by_name(age_group_name=age_group)
    if not age_group:
        return "No age group", 400

    create_request(
        author_id=author.id, author_names=authors, institution=institution, email=email, nomination_id=nomination.id, 
        age_group_id=age_group.id, title=project_name, description_path=description_path, consent_path=consent_file_path, 
        category="На рассмотрении", external_links=links
    )

    return "Created", 201


@app.route("/api/request/set_category", methods=["POST"])
def _request_set_category() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    req_id: int = data.get("id", -1)
    category: str = data.get("category", "")

    update_request(request_id=req_id, category=category)
    return "Moved", 200


@app.route("/api/moderators", methods=["GET"])
def _get_moderators() -> tuple:
    return [{"name": moderator.name, "email": moderator.email} for moderator in get_all_moderators()], 200


@app.route("/api/moderator", methods=["POST"])
def _add_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")

    user = get_user_by_email(email=email)
    moderator = create_moderator(name=name, email=email)
    if moderator and user:
        create_user_moderator(user_id=user.id, moderator_id=moderator.id)
        return "Added", 200
    
    return "Wrong data", 400


@app.route("/api/moderator", methods=["DELETE"])
def _delete_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    email: str = data.get("email", "")
    user = get_user_by_email(email=email)
    if user:
        moderator = get_moderators_by_user(user_id=user.id)[-1]
        if moderator:
            delete_moderator(moderator_id=moderator.id)
            return "Deleted", 200

    return "Wrong data", 400


@app.route("/api/nominations", methods=["GET"])
def _get_nominations() -> tuple:
    return [x.name for x in get_all_nominations()], 200


@app.route("/api/nomination", methods=["POST"])
def _add_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    create_nomination(name=name)
    return "Added", 200


@app.route("/api/nomination", methods=["DELETE"])
def _delete_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    nomination = get_nomination_by_name(nomination_name=name)
    if nomination:
        delete_nomination(nomination_id=nomination.id)

    return "Deleted", 200


@app.route("/api/age_groups", methods=["GET"])
def _get_age_groups() -> tuple:
    return [x.name for x in get_all_age_groups()], 200


@app.route("/api/age_group", methods=["POST"])
def _add_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    create_age_group(name=name)
    return "Added", 200


@app.route("/api/age_group", methods=["DELETE"])
def _delete_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    age_group = get_age_group_by_name(age_group_name=name)
    if age_group:
        delete_age_group(age_group_id=age_group.id)

    return "Deleted", 200


@app.route("/api/posts", methods=["POST"])
def _create_post() -> tuple:
    if 'content' not in request.files:
        return "No content file", 400

    file = request.files['content']
    author = request.form.get("author")
    category = request.form.get("category")
    if not author or not category:
        return "Missing author or category", 400

    category_folder = os.path.join(UPLOAD_FOLDER, category)
    os.makedirs(category_folder, exist_ok=True)

    filename = f"{secure_filename(author)}_{int(datetime.utcnow().timestamp())}.txt"
    file_path = os.path.join(category_folder, filename)
    file.save(file_path)

    new_post = create_post(author=author, category=category, content_path=file_path)
    return {"id": new_post.id, "message": "Added"}, 200


@app.route("/api/posts", methods=["GET"])
def _get_posts() -> tuple:
    data: dict | None = request.args
    if not data:
        return "No data", 500
    
    posts = get_posts_by_category(category=data.get("category"))
    posts_data = [post.to_dict() for post in posts]
    return jsonify(posts_data), 200


@app.route("/api/posts/<int:post_id>", methods=["DELETE"])
def _delete_post(post_id: int) -> tuple:
    delete_post(post_id=post_id)
    return "Deleted", 200


# endregion
