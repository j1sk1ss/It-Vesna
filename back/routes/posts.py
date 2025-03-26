from flask import current_app as app, jsonify
from flask import request
from werkzeug.utils import secure_filename

from back.common.misc import require_authorization
from back.models import *


@app.route("/api/posts", methods=["POST"])
@require_authorization
def _create_post() -> tuple:
    if 'content' not in request.files:
        return "No content file", 400

    file = request.files['content']
    author = request.form.get("author")
    category = request.form.get("category")
    if not author or not category:
        return "Missing author or category", 400

    category_folder = os.path.join(app.config['POSTS_FOLDER'], category)
    os.makedirs(category_folder, exist_ok=True)

    filename = f"{secure_filename(author)}_{int(datetime.utcnow().timestamp())}.txt"
    file_path = os.path.join(category_folder, filename)
    file.save(file_path)

    new_post = create_post(author=author, category=category, content_path=file_path)
    return {"id": new_post.id, "message": "Added"}, 201


@app.route("/api/posts", methods=["GET"])
def _get_posts() -> tuple:
    data: dict | None = request.args
    if not data:
        return "No data", 400
    
    posts = get_posts_by_category(category=data.get("category"))
    posts_data = [post.to_dict() for post in posts]
    return jsonify(posts_data), 200


@app.route("/api/posts/<int:post_id>", methods=["DELETE"])
@require_authorization
def _delete_post(post_id: int) -> tuple:
    delete_post(post_id=post_id)
    return "Deleted", 200