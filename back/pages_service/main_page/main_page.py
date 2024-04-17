from datetime import datetime, timedelta

import requests
import os
import uuid


API_URL = "http://it-vesna-api-service-1:27001/api"


def load_posts_by_category(category):
    return requests.get(f'{API_URL}/posts/{category}')

def delete_post_by_id(post_id):
    return requests.delete(f'{API_URL}/posts/{post_id}')

def create_new_post(author, data, category):
    filename  = str(uuid.uuid4()) + ".txt"
    post_path = os.path.join("data/posts", category, filename)
    os.makedirs(os.path.dirname(post_path), exist_ok=True)

    with open(post_path, "w") as file:
        file.write(data)

    return requests.post(f'{API_URL}/posts', 
                         json={
                             'author': author,
                             'path': post_path,
                             'category': category
                         })

def change_post(post_id, pin_status = "-1", new_data = ""):
    if pin_status == '1':
        # get post category, then all category posts and unpin previous pinned
        post_data = requests.get(f'{API_URL}/posts/{post_id}')
        category_posts = requests.get(f'{API_URL}/posts/{post_data['category']}')
        for post in category_posts:
            if post['pinned'] == '1':
                requests.delete(f'{API_URL}/posts/pin/{post['uid']}')

        return requests.post(f'{API_URL}/posts/pin/{post_id}')
    
    elif pin_status == '0':
        return requests.delete(f'{API_URL}/posts/pin/{post_id}')

    return 0