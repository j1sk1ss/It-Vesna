import requests


SERVER = 'http://it-vesna-posts-db-service-1:27006'


def add_post(author, path, category):
    return requests.post(f'{SERVER}/posts',
                         json={
                             'author_uid': author,
                             'path': path,
                             'category': category
                         })

def delete_post(post_id):
    return requests.delete(f'{SERVER}/posts/{post_id}')

def get_posts():
    return requests.get(f'{SERVER}/posts')

def get_posts_by_category(category):
    return requests.get(f'{SERVER}/posts/{category}')

def get_posts_by_id(post_id):
    return requests.get(f'{SERVER}/posts/{post_id}')

def pin_post(post_id):
    return requests.post(f'{SERVER}/posts/pinned/{post_id}')

def unpin_post(post_id):
    return requests.post(f'{SERVER}/posts/unpinned/{post_id}')