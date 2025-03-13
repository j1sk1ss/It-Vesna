import os
import hmac
import base64
import hashlib

temp_keys_list: list = []


def generate_access_key(username: str, userpass: str) -> str:
    access_key = _get_hash(f"{username}:{userpass}")
    temp_keys_list.append(access_key)
    return access_key


def _get_hash(userpass: str) -> str:
    data = userpass.encode()
    key = hmac.new("сщквуддЫфде".encode(), data, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(key).decode().replace(":", "")


def verify_access_key(key: str) -> bool:
    return key in temp_keys_list