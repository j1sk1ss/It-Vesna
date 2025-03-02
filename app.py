import os
from datetime import datetime

from flask_cors import CORS
from flask import Flask, render_template, abort, request
from flask_sqlalchemy import SQLAlchemy


def _find_templates() -> dict:
    routes: dict = {}
    for root, _, files in os.walk(app.template_folder):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), app.template_folder)
                route = "/" + rel_path.replace("\\", "/").replace(".html", "")
                routes[route] = rel_path.replace("\\", "/")
    return routes

UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app: Flask = Flask(__name__, template_folder="templates", static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:root@localhost:5001/vesna'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)
db: SQLAlchemy = SQLAlchemy(app)
TEMPLATES = _find_templates()


# region [Models]

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    requests = db.relationship('Request', backref='author', lazy=True)
    moderators = db.relationship('Moderator', secondary='user_moderator', backref='users')


class Moderator(db.Model):
    __tablename__ = 'moderators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class UserModerator(db.Model):
    __tablename__ = 'user_moderator'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    moderator_id = db.Column(db.Integer, db.ForeignKey('moderators.id'), primary_key=True)


class Request(db.Model):
    __tablename__ = 'requests'
    
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    nomination_id = db.Column(db.Integer, db.ForeignKey('nominations.id'), nullable=False)
    age_group_id = db.Column(db.Integer, db.ForeignKey('age_groups.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    institution = db.Column(db.String(255), nullable=False)
    description_path = db.Column(db.String(255), nullable=False)
    consent_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(100), nullable=True)
    
    nomination = db.relationship('Nomination', backref='requests', lazy=True)
    age_group = db.relationship('AgeGroup', backref='requests', lazy=True)
    authors = db.Column(db.JSON, nullable=True) 
    external_links = db.Column(db.JSON, nullable=True)

    def get_authors_full_name(self):
        return self.authors if self.authors else []
    
    def get_external_links(self):
        return self.external_links if self.external_links else []
    
    def parse_request(self) -> dict:
        authors = self.get_authors_full_name()
        nomination = self.nomination.name if self.nomination else None
        age_group = self.age_group.name if self.age_group else None
        external_links = self.get_external_links()
        
        return {
            "id": self.id,
            "author": self.author_id,
            "email": self.email,
            "nomination": nomination,
            "age_group": age_group,
            "title": self.title,
            "description": self.description_path,
            "consent": self.consent_path,
            "authors": authors,
            "links": external_links,
            "expanded": False
        }


class Nomination(db.Model):
    __tablename__ = 'nominations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    

class AgeGroup(db.Model):
    __tablename__ = 'age_groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)


def create_age_group(name: str) -> AgeGroup:
    new_age_group = AgeGroup(name=name)
    db.session.add(new_age_group)
    db.session.commit()
    return new_age_group


def get_age_group(age_group_id: int) -> AgeGroup:
    age_group = AgeGroup.query.get_or_404(age_group_id)
    return age_group


def get_all_age_groups() -> list:
    age_groups = AgeGroup.query.all()
    return age_groups


def get_age_group_by_name(age_group_name: str) -> AgeGroup:
    age_group = AgeGroup.query.filter_by(name=age_group_name).first()
    if age_group is None:
        raise ValueError(f"Возрастная группа с названием '{age_group_name}' не найдена.")
    
    return age_group


def update_age_group(age_group_id: int, name: str = None) -> AgeGroup:
    age_group = AgeGroup.query.get_or_404(age_group_id)
    if name:
        age_group.name = name
    db.session.commit()
    return age_group


def delete_age_group(age_group_id: int) -> AgeGroup:
    age_group = AgeGroup.query.get_or_404(age_group_id)
    db.session.delete(age_group)
    db.session.commit()
    return age_group


def create_user_moderator(user_id: int, moderator_id: int) -> UserModerator:
    new_user_moderator = UserModerator(user_id=user_id, moderator_id=moderator_id)
    db.session.add(new_user_moderator)
    db.session.commit()
    return new_user_moderator


def get_user_moderator(user_id: int, moderator_id: int) -> UserModerator:
    user_moderator = UserModerator.query.filter_by(user_id=user_id, moderator_id=moderator_id).first()
    if user_moderator is None:
        raise ValueError("Связь между пользователем и модератором не найдена.")
    
    return user_moderator


def get_moderators_by_user(user_id: int) -> list[Moderator]:
    user_moderators = UserModerator.query.filter_by(user_id=user_id).all()
    if not user_moderators:
        raise ValueError("Связи с пользователем не найдены.")
    
    moderators = [moderator.moderator for moderator in user_moderators]
    return moderators


def delete_user_moderator(user_id: int, moderator_id: int) -> UserModerator:
    user_moderator = UserModerator.query.filter_by(user_id=user_id, moderator_id=moderator_id).first()
    if user_moderator is None:
        raise ValueError("Связь между пользователем и модератором не найдена.")
    
    db.session.delete(user_moderator)
    db.session.commit()
    return user_moderator


def create_moderator(name: str, email: str) -> Moderator:
    new_moderator = Moderator(name=name, email=email)
    db.session.add(new_moderator)
    db.session.commit()
    return new_moderator


def get_moderator(moderator_id: int) -> Moderator:
    moderator = Moderator.query.get_or_404(moderator_id)
    return moderator


def get_all_moderators() -> list:
    moderators = Moderator.query.all()
    return moderators


def update_moderator(moderator_id: int, name: str = None, email: str = None) -> Moderator:
    moderator: Moderator = Moderator.query.get_or_404(moderator_id)
    if name:
        moderator.name = name

    if email:
        moderator.email = email

    db.session.commit()
    return moderator


def delete_moderator(moderator_id: int) -> Moderator:
    moderator = Moderator.query.get_or_404(moderator_id)
    db.session.delete(moderator)
    db.session.commit()
    return moderator


def create_nomination(name: str) -> Nomination:
    new_nomination = Nomination(name=name)
    db.session.add(new_nomination)
    db.session.commit()
    return new_nomination


def get_nomination(nomination_id: int) -> Nomination:
    nomination = Nomination.query.get_or_404(nomination_id)
    return nomination


def get_all_nominations() -> list:
    nominations = Nomination.query.all()
    return nominations


def get_nomination_by_name(nomination_name: str) -> Nomination:
    nomination = Nomination.query.filter_by(name=nomination_name).first()
    if nomination is None:
        raise ValueError(f"Номинация с именем '{nomination_name}' не найдена.")
    
    return nomination


def update_nomination(nomination_id: int, name: str = None) -> Nomination:
    nomination = Nomination.query.get_or_404(nomination_id)
    if name:
        nomination.name = name
    db.session.commit()
    return nomination


def delete_nomination(nomination_id: int) -> Nomination:
    nomination = Nomination.query.get_or_404(nomination_id)
    db.session.delete(nomination)
    db.session.commit()
    return nomination


def create_request(
        author_id: int, 
        author_names: list, 
        institution: str,
        email: str, 
        nomination_id: int, 
        age_group_id: int, 
        title: str, 
        description_path: str, 
        consent_path: str, 
        category: str = None,
        external_links: list = None 
) -> Request:
    new_request = Request(
        author_id=author_id,
        email=email,
        institution=institution,
        nomination_id=nomination_id,
        age_group_id=age_group_id,
        title=title,
        description_path=description_path,
        consent_path=consent_path,
        category=category,
        authors=author_names,
        external_links=external_links if external_links else [],
    )
    
    db.session.add(new_request)
    db.session.commit()
    return new_request


def get_request(request_id: int) -> Request:
    request_item = Request.query.get_or_404(request_id)
    return request_item


def get_all_requests() -> list[Request]:
    requests = Request.query.all()
    return requests


def update_request(
        request_id: int, 
        title: str = None, 
        email: str = None, 
        nomination_id: int = None, 
        age_group_id: int = None, 
        description_path: str = None, 
        consent_path: str = None, 
        category: str = None
) -> Request:
    request_item: Request = Request.query.get_or_404(request_id)
    if title:
        request_item.title = title

    if email:
        request_item.email = email

    if nomination_id:
        request_item.nomination_id = nomination_id

    if age_group_id:
        request_item.age_group_id = age_group_id

    if description_path:
        request_item.description_path = description_path

    if consent_path:
        request_item.consent_path = consent_path

    if category is not None:
        request_item.category = category

    db.session.commit()
    return request_item


def delete_request(request_id: int) -> Request:
    request_item = Request.query.get_or_404(request_id)
    db.session.delete(request_item)
    db.session.commit()
    return request_item


def create_user(name: str, email: str, password: str) -> User:
    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return new_user


def get_user(user_id: int) -> User:
    user = User.query.get_or_404(user_id)
    return user


def get_user_by_email(email: str) -> User:
    user = User.query.filter_by(email=email).first()
    if user is None:
        raise ValueError(f"Пользователь с email {email} не найден.")
    
    return user


def update_user(user_id: int, name: str | None = None, email: str | None = None, password: str | None = None) -> User:
    user: User = User.query.get_or_404(user_id)
    if name:
        user.name = name

    if email:
        user.email = email

    if password:
        user.password = password

    db.session.commit()
    return user


def delete_user(user_id: int) -> User:
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return user

# endregion

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


@app.route("/api/nomination", methods=["DELETE"]) # DB
def _delete_nomination() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    return "Added", 200


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


@app.route("/api/age_group", methods=["DELETE"]) # DB
def _delete_age_group() -> tuple:
    data: dict | None = request.json
    if not data:
        return "No data", 500

    name: str = data.get("name", "")
    return "Added", 200

# endregion


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    