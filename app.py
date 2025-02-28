import os
from flask import Flask, render_template, abort


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
TEMPLATES = _find_templates()


@app.route('/<path:subpath>')
def dynamic_route(subpath: str):
    template_path = TEMPLATES.get("/" + subpath)
    if template_path:
        return render_template(template_path)
    
    abort(404)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    