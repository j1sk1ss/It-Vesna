import os
import requests
from werkzeug.utils import secure_filename


API_URL = "http://it-vesna-api-service-1:5000/api"


def create_application(id, authors, age_group, mail, nomination, institution, links, name, description, agreement):
    data_dir = '/var/www/it-vesna/server/data'
    applications_dir = os.path.join(data_dir, 'applications')
    os.makedirs(applications_dir, exist_ok=True)

    new_apl_dir = os.path.join(applications_dir, f'application_{secure_filename(name)}')
    os.makedirs(new_apl_dir, exist_ok=True)

    with open(f'{new_apl_dir}/application_{secure_filename(name)}.txt', 'w') as file:
        file.write(f'Авторы: {authors} (||)\n')
        file.write(f'Возрастная группа: {age_group} (||)\n')
        file.write(f'E-mail: {mail} (||)\n')
        file.write(f'Номинация: {nomination} (||)\n')
        file.write(f'Учреждение: {institution} (||)\n')
        file.write(f'Ссылки: {links} (||)\n')
        file.write(f'Название: {name} (||)\n')
        file.write(f'Описание: {description}')
    
    agreement.save(new_apl_dir)

    return requests.post(f'{API_URL}/application', json={
        "ID": id,
        "Name": name,
        "Path": f'{new_apl_dir}/application_{secure_filename(name)}.txt'
    })