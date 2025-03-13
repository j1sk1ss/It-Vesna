from flask import current_app as app
from flask import request

from back.common.misc import require_authorization
from back.models import *


@app.route("/api/requests", methods=["GET"])
@require_authorization
def _get_requests() -> tuple:
    category = request.args.get('category', None)
    requests = get_all_requests()

    if category:
        requests = [req for req in requests if req.category == category]
    
    response = {
        "На рассмотрении": [],
        "Принятые": [],
        "Архив": []
    }

    if requests:
        for req in requests:
            if req.category == "Принятые":
                response["Принятые"].append(req.parse_request())
            elif req.category == "На рассмотрении":
                response["На рассмотрении"].append(req.parse_request())
            elif req.category == "Архив":
                response["Архив"].append(req.parse_request())

    return response, 200


@app.route("/api/request", methods=["DELETE"])
@require_authorization
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
@require_authorization
def _request_set_category() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    req_id: int = data.get("id", -1)
    category: str = data.get("category", "")

    update_request(request_id=req_id, category=category)
    return "Moved", 200
