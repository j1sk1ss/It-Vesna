import os

from flask import current_app as app, send_from_directory
from flask import render_template, abort

from back.models import *
from back.common.misc import find_templates


TEMPLATES: dict = find_templates('/app/templates')
app.config['UPLOAD_FOLDER'] = '/app/static/uploads'
app.config['POSTS_FOLDER'] = '/app/static/posts'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['POSTS_FOLDER'], exist_ok=True)


@app.route("/<path:subpath>", methods=["GET"])
def dynamic_route(subpath: str):
    if subpath.startswith("app/static/"):
        return send_from_directory(app.static_folder, subpath[len("app/static/"):])

    try:
        template_path = TEMPLATES.get("/" + subpath)
        if template_path:
            return render_template(template_path)
        else:
            abort(404)
    except Exception as ex:
        app.logger.error("Template not Found! Error %s", str(ex))
        abort(500)


from back.routes.age_groups import *
from back.routes.entry import *
from back.routes.moderator import *
from back.routes.nominations import *
from back.routes.posts import *
from back.routes.requests import *