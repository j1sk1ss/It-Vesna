let selectedTab = 'Заявки';
let subTab = 'На рассмотрении';

let moderators = [];
let nominations = [];
let requests = {};


document.addEventListener('DOMContentLoaded', function() {
    setTab('Заявки');
    setSubTab('На рассмотрении');
});


function setTab(tab) {
    selectedTab = tab;
    if (tab === 'Заявки') {
        subTab = 'На рассмотрении';
        fetch('/api/requests')
            .then(response => response.json())
            .then(data => {
                requests = data;
                updateContent();
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }
    else if (tab === 'Модераторы') {
        fetch('/api/moderators')
            .then(response => response.json())
            .then(data => {
                moderators = data;
                updateContent();
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }
    else if (tab === 'Номинации') {
        fetch('/api/nominations')
            .then(response => response.json())
            .then(data => {
                nominations = data;
                updateContent();
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }
    
    document.querySelectorAll('.tab').forEach(tabElement => tabElement.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
}

function setSubTab(tab) {
    subTab = tab;
    updateContent();
    document.querySelectorAll('.sub-tab').forEach(subTabElement => subTabElement.classList.remove('active'));
    document.querySelector(`.sub-tab[data-sub-tab="${tab}"]`).classList.add('active');
}

function toggleExpand(id, el) {
    Object.keys(requests).forEach(category => {
        const request = requests[category].find(req => req.id === id);
        if (request) {
            const element = document.getElementById(`request-${id}`);
            const details = element.querySelector('.details');

            if (request.expanded) {
                details.style.opacity = '0';
                details.style.maxHeight = '0px';

                setTimeout(() => {
                    details.style.display = 'none';
                    element.classList.remove('expanded');
                }, 300);
                el.src = 'admin/view.png';
                el.classList.remove('icon-view-open');
            } else {
                details.style.display = 'block';
                setTimeout(() => {
                    details.style.opacity = '1';
                    details.style.maxHeight = '500px';
                }, 10);
                element.classList.add('expanded');
                el.src = 'admin/view_open.png';
                el.classList.add('icon-view-open');
            }

            request.expanded = !request.expanded;
        }
    });
}

function moveRequest(id, targetCategory) {
    Object.keys(requests).forEach(category => {
        const index = requests[category].findIndex(req => req.id === id);
        if (index !== -1) {
            const request = requests[category][index];
            request.expanded = false;

            fetch('/api/request/set_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: request.id,
                    category: targetCategory,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Запрос успешно перемещён:', data);
            })
            .catch(error => {
                console.error('Ошибка при перемещении запроса:', error);
            });
        }
    });

    updateContent();
}

function deleteRequest(id) {
    Object.keys(requests).forEach(category => {
        const index = requests[category].findIndex(req => req.id === id);
        if (index !== -1) {
            const request = requests[category].splice(index, 1)[0];
            fetch('/api/request', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: request.id,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Запрос успешно удалён:', data);
            })
            .catch(error => {
                console.error('Ошибка при удалении запроса:', error);
            });
        }
    });

    updateContent();
}

function addModerator() {
    const email = document.getElementById('moderator-email').value;
    const name  = document.getElementById('moderator-name').value;
    if (email && name) {
        fetch('/api/moderator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                name: name
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Модератор добавлен:', data);
        })
        .catch(error => {
            console.error('Ошибка при добавлении модератора:', error);
        });

        document.getElementById('moderator-email').value = '';
        document.getElementById('moderator-name').value = '';
        updateContent();
    }
}

function deleteModerator(index) {
    const moderator = moderators[index];
    fetch('/api/moderator', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: moderator.email }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Модератор удалён:', data);
    })
    .catch(error => {
        console.error('Ошибка при удалении модератора:', error);
    });

    updateContent();
}

function addNomination() {
    const nominationName = document.getElementById('nomination-name').value;
    if (nominationName) {
        fetch('/api/nomination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nominationName }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Номинация добавлена:', data);
        })
        .catch(error => {
            console.error('Ошибка при добавлении номинации:', error);
        });

        document.getElementById('nomination-name').value = '';
        updateContent();
    } else {
        alert('Пожалуйста, заполните поле с названием номинации.');
    }
}

function deleteNomination(index) {
    const nominationName = nominations[index];
    fetch('/api/nomination', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nominationName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Номинация удалена:', data);
    })
    .catch(error => {
        console.error('Ошибка при удалении номинации:', error);
    });

    updateContent();
}

function updateContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const subTabsContainer = document.getElementById('subTabs');
    subTabsContainer.style.display = selectedTab === 'Заявки' ? 'flex' : 'none';

    if (selectedTab === 'Заявки') {
        renderRequests(content);
    } else if (selectedTab === 'Модераторы') {
        renderForm(content, 'moderator', 'Имя модератора', 'Почта модератора', addModerator);
        renderList(content, 'moderators-list', moderators, deleteModerator);
    } else if (selectedTab === 'Номинации') {
        renderForm(content, 'nomination', 'Название номинации', null, addNomination);
        renderList(content, 'nominations-list', nominations, deleteNomination);
    } else {
        content.innerHTML = `<p>Контент для вкладки "${selectedTab}"</p>`;
    }
}

function renderRequests(container) {
    if (!requests[subTab]) return;

    requests[subTab].forEach(request => {
        const div = document.createElement('div');
        div.classList.add('request');
        if (request.expanded) div.classList.add('expanded');
        div.id = `request-${request.id}`;

        // Преобразуем массивы в строки
        const authors = Array.isArray(request.author) ? request.author.join(', ') : request.author;
        const links = Array.isArray(request.links) ? request.links.map(link => `<a href="${link}" target="_blank">${link}</a>`).join(', ') : request.links;

        div.innerHTML = `
            <div class="request-header">
                <span><strong>${authors}</strong> - ${request.title}</span>
                <div class="buttons">
                    <img src="${request.expanded ? 'admin/view_open.png' : 'admin/view.png'}" 
                        class="icon${request.expanded ? '-view' : ''}" 
                        onclick="toggleExpand(${request.id}, this)">
                    ${subTab === 'На рассмотрении' ? `
                        <img src="admin/archive.png" class="icon" onclick="moveRequest(${request.id}, 'Архив', this)">
                        <img src="admin/accept.png" class="icon" onclick="moveRequest(${request.id}, 'Принятые', this)">
                        <img src="admin/decline.png" class="icon" onclick="deleteRequest(${request.id}, this)">
                    ` : ''}
                </div>
            </div>
            <div class="details" style="display: ${request.expanded ? 'block' : 'none'};">
                <p><strong>ФИО:</strong> ${authors}</p>
                <p><strong>Почта:</strong> ${request.email}</p>
                <p><strong>Номинация:</strong> ${request.nomination}</p>
                <p><strong>Название:</strong> ${request.title}</p>
                <p><strong>Описание:</strong> ${request.description}</p>
                <p><strong>Согласие:</strong> ${request.consent}</p>
                <p><strong>Ссылки:</strong> ${links}</p>
            </div>
        `;

        container.appendChild(div);
    });
}

function renderForm(container, type, placeholder1, placeholder2, submitHandler) {
    const form = document.createElement('div');
    form.classList.add('request', 'moderator-form');
    form.style.backgroundColor = 'transparent';

    form.innerHTML = `
        <input type="text" id="${type}-name" class="input-field" placeholder="${placeholder1}" />
        ${placeholder2 ? `<input type="email" id="${type}-email" class="input-field" placeholder="${placeholder2}" />` : ''}
        <button onclick="${submitHandler.name}()">Добавить</button>
    `;

    container.appendChild(form);
}

function renderList(container, listId, data, deleteHandler) {
    const list = document.createElement('ul');
    list.id = listId;

    if (data.length > 0) {
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = typeof item === 'object' ? `${item.name} (${item.email})` : item;

            const deleteButton = document.createElement('img');
            deleteButton.src = 'admin/delete.png';
            deleteButton.className = 'icon';
            deleteButton.onclick = () => deleteHandler(index);

            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    } else {
        list.innerHTML = `<p>Нет данных</p>`;
    }

    container.appendChild(list);
}
