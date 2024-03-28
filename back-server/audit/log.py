import datetime


AUDIT_PATH = "" # TODO: Path


# Add log line with simple message and link
# message - message for logging
# link - associated link with this log
def log(message, link = "main_page.ru"):
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    with open(AUDIT_PATH + 'audit_log.txt', 'a') as log_file:
        log_file.write(f"Time {timestamp}: {message}\nWhere: {link}\n")