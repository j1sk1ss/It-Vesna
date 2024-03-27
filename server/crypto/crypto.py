import string
import bcrypt


# Converts string to hash with salt
# string - string for converting
# return: hash, salt
def string2hash(string: str):
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(string.encode('utf-8'), salt=salt)
    return hash, salt

# Compare string with hash (requires salt)
# string - string for compare
# hash - hash for compare
# salt - salt that was used in hash generation
# return: True or false
def compare_string_hash(string: str, hash: str, salt: str):
    string_hash = bcrypt.hashpw(string.encode('utf-8'), salt=salt)
    return string_hash == hash
