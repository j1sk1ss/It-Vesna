# ==================
# Importing packages

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy



# ==================
# Configuring server on starting

ALLOWED_IP = [
    'it-vesna-api-service-1'
]  

DB_NAME = "it-vesna-posts-db" # TODO: Move to local data. Don't store it here
USER_NAME = "root"
DB_PASS = "28072003"
DB_HOST = "it-vesna-posts-db-1:27007"

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER_NAME}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


@app.before_request
def limit_remote_addr():
    if request.remote_addr not in ALLOWED_IP:
        return 'ip not allowed'
    
    
    
# =============================================================
# Setup SQL models

class Posts(db.Model):
    uid        = db.Column(db.Integer, primary_key=True)
    author_uid = db.Column(db.Integer)
    postpath   = db.Column(db.String(255))
    pinned     = db.Column(db.Integer)
    category   = db.Column(db.String(255))



# =============================================================
#   API for working with nominations data in DB
# =============================================================

# ============================
# Add post
# POST http://it-vesna-nom-db-service-1:27006/posts
# JSON request: {
#     "author_uid": "uid",
#     "path": "path_to_post_on_local",
#     "category": "post_category"
# }
# RETURN: "success"
@app.route('/posts', methods=['POST'])
def add_post():
    data = request.json
    new_post = Posts(author_uid=data['author_uid'], postpath=data['path'], pinned=0, category=data['category'])
    db.session.add(new_post)
    db.session.commit()
    return 'success'


# ============================
# Delete post
# DELETE http://it-vesna-nom-db-service-1:27006/posts/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Posts.query.get(post_id)
    if post:
        db.session.delete(post)
        db.session.commit()
        return 'success'
    else:
        return 'not found'


# ============================
# Get all posts
# GET http://it-vesna-nom-db-service-1:27006/posts
# RETURN: 
# [{
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }, ... ]
@app.route('/posts', methods=['GET'])
def get_posts():
    posts      = Posts.query.all()
    posts_list = [{'uid': post.uid, 
                   'author_uid': post.author_uid, 
                   'path': post.postpath, 
                   'pinned': post.pinned, 
                   'category': post.category} 
                  for post in posts]
    
    return jsonify(posts_list)


# ============================
# Get posts by categy
# GET http://it-vesna-nom-db-service-1:27006/posts/<string:category>
# RETURN: 
# [{
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# }, ... ]
@app.route('/posts/<string:category>', methods=['GET'])
def get_posts_by_category(category):
    posts      = Posts.query.filter_by(category=category).all()
    posts_list = [{'uid': post.uid, 
                   'author_uid': post.author_uid, 
                   'postpath': post.postpath, 
                   'pinned': post.pinned, 
                   'category': post.category} 
                  for post in posts]
    
    return jsonify(posts_list)


# ============================
# Get posts by id
# GET http://it-vesna-nom-db-service-1:27006/posts/<int:post_id>
# RETURN: 
# {
#    "uid": post_uid,
#    "author_uid": author_uid,
#    "path": path_to_post,
#    "pinned": is_pinned,
#    "category": post_category
# } / "not found"
@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post_by_id(post_id):
    post = Posts.query.get(post_id)
    if post:
        return jsonify({'uid': post.uid, 
                        'author_uid': post.author_uid, 
                        'postpath': post.postpath, 
                        'pinned': post.pinned, 
                        'category': post.category})
    else:
        return 'not found'


# ============================
# Pin post
# POST http://it-vesna-nom-db-service-1:27006/posts/pinned/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/posts/pinned/<int:post_id>', methods=['POST'])
def pin_post(post_id):
    post = Posts.query.get(post_id)
    if post:
        post.pinned = 1
        db.session.commit()
        return 'success'
    else:
        return 'not found'


# ============================
# Unpin post
# POST http://it-vesna-nom-db-service-1:27006/posts/unpinned/<int:post_id>
# RETURN: "success" / "not found"
@app.route('/posts/unpinned/<int:post_id>', methods=['POST'])
def unpin_post(post_id):
    post = Posts.query.get(post_id)
    if post:
        post.pinned = 0
        db.session.commit()
        return 'success'
    else:
        return 'not found'



# =============================================================
# Start server with static ip
app.run(host='0.0.0.0', port='5000')