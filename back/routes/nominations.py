from flask import current_app as app
from flask import request

from back.common.misc import require_authorization
from back.models import *


@app.route("/api/nominations", methods=["GET"])
def _get_nominations() -> tuple:
    return [x.name for x in get_all_nominations()], 200


@app.route("/api/nomination", methods=["POST"])
@require_authorization
def _add_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500
    
    name: str = data.get("name", "")
    create_nomination(name=name)
    return "Added", 200


@app.route("/api/nomination", methods=["DELETE"])
@require_authorization
def _delete_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    nomination = get_nomination_by_name(nomination_name=name)
    if nomination:
        delete_nomination(nomination_id=nomination.id)

    return "Deleted", 200