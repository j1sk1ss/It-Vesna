import os
from app import db
from datetime import datetime


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


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    content_path = db.Column(db.String(255), nullable=False)
    pin = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "author": self.author,
            "category": self.category,
            "created_at": self.created_at.isoformat(),
            "content_path": self.content_path,
            "pin": self.pin
        }

# endregion


# region [CRUDS]

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
    request_item: Request = Request.query.get_or_404(request_id)
    os.remove(request_item.description_path[1:])
    os.remove(request_item.consent_path[1:])
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


def create_post(author: str, category: str, content_path: str) -> Post:
    new_post = Post(author=author, category=category, content_path=content_path, pin=0)
    db.session.add(new_post)
    db.session.commit()
    return new_post


def get_posts() -> list[Post]:
    return Post.query.all()


def get_post(post_id: int) -> Post:
    return Post.query.get_or_404(id=post_id)


def get_posts_by_category(category: str) -> list[Post]:
    return Post.query.filter_by(category=category).all()


def update_post(
    post_id: int, 
    author: str = None, 
    category: str = None, 
    content_path: str = None,
    pin: int = 0
) -> bool:
    post: Post = Post.query.get_or_404(id=post_id)
    if author:
        post.author = author

    if category:
        post.category = category

    if content_path:
        post.content_path = content_path

    post.pin = pin
    db.session.commit()
    return True


def delete_post(post_id: int) -> bool:
    post: Post = Post.query.get_or_404(post_id)
    os.remove(post.content_path)
    db.session.delete(post)
    db.session.commit()
    return True
