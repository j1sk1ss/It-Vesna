import requests


SERVER = 'http://it-vesna-posts-db-service-1:5000'


def db_add_post(author, path, category):
    return requests.post(f'{SERVER}/posts',
                         json={
                             'author_uid': author,
                             'path': path,
                             'category': category
                         }).text

def db_delete_post(post_id):
    return requests.delete(f'{SERVER}/posts/{post_id}').text

def db_get_posts():
    return requests.get(f'{SERVER}/posts').text

def db_get_posts_by_category(category):
    return requests.get(f'{SERVER}/posts/{category}').text

def db_get_posts_by_id(post_id):
    return requests.get(f'{SERVER}/posts/{post_id}').text

def db_pin_post(post_id):
    return requests.post(f'{SERVER}/posts/pinned/{post_id}').text

def db_unpin_post(post_id):
    return requests.post(f'{SERVER}/posts/unpinned/{post_id}').text