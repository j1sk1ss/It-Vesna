from flask import current_app as app
from flask import request

from back.common.misc import require_authorization
from back.models import *


@app.route("/api/age_groups", methods=["GET"])
def _get_age_groups() -> tuple:
    return [x.name for x in get_all_age_groups()], 200


@app.route("/api/age_group", methods=["POST"])
@require_authorization
def _add_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    name: str = data.get("name", "")
    create_age_group(name=name)
    return "Added", 201


@app.route("/api/age_group", methods=["DELETE"])
@require_authorization
def _delete_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400

    name: str = data.get("name", "")
    age_group = get_age_group_by_name(age_group_name=name)
    if age_group:
        delete_age_group(age_group_id=age_group.id)

    return "Deleted", 200