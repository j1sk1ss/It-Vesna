from flask import current_app as app
from flask import request

from back.common.misc import require_authorization
from back.models import *


@app.route("/api/moderators", methods=["GET"])
@require_authorization
def _get_moderators() -> tuple:
    return [{"name": moderator.name, "email": moderator.email} for moderator in get_all_moderators()], 200


@app.route("/api/moderator", methods=["POST"])
@require_authorization
def _add_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400
    
    name: str = data.get("name", "")
    email: str = data.get("email", "")

    user = get_user_by_email(email=email)
    moderator = create_moderator(name=name, email=email)
    if moderator and user:
        create_user_moderator(user_id=user.id, moderator_id=moderator.id)
        return "Added", 201
    
    return "Wrong data", 400


@app.route("/api/moderator", methods=["DELETE"])
@require_authorization
def _delete_moderator() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 400

    email: str = data.get("email", "")
    user = get_user_by_email(email=email)
    if user:
        moderator = get_moderators_by_user(user_id=user.id)[-1]
        if moderator:
            delete_moderator(moderator_id=moderator.id)
            return "Deleted", 200

    return "Wrong data", 400