import os


def find_templates(template: str) -> dict:
    routes: dict = {}
    for root, _, files in os.walk(template):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), template)
                route = "/" + rel_path.replace("\\", "/").replace(".html", "")
                routes[route] = rel_path.replace("\\", "/")

    return routes