from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


db: SQLAlchemy = SQLAlchemy()


def create_app() -> Flask:
    """Construct the core application."""
    app: Flask = Flask(__name__, template_folder="templates", static_folder="static")
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:root@db:5432/vesna'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)
    
    # Initialize Database Plugin
    db.init_app(app)
    with app.app_context():
        import routes  # Import routes
        return app
    
    