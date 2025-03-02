let selectedTab = 'Заявки';
let subTab = 'На рассмотрении';

const requests = {
    "На рассмотрении": [
        { id: 1, author: 'Иван Иванов', email: 'ivan@example.com', nomination: 'Web', title: 'Разработка веб-приложения', description: 'Описание проекта...', consent: 'Согласен', links: 'github.com/example', expanded: false },
        { id: 2, author: 'Петр Петров', email: 'petr@example.com', nomination: 'GameDev', title: 'Игра на Unity', description: 'Описание проекта...', consent: 'Согласен', links: 'github.com/example2', expanded: false }
    ],
    "Принятые": [],
    "Архив": []
};

const moderators = []; // Список модераторов
const nominations = []; // Список номинаций

// Устанавливаем вкладку "Заявки" и подвкладку "На рассмотрении" при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTab('Заявки');
    setSubTab('На рассмотрении');
    updateContent();
});

function setTab(tab) {
    selectedTab = tab;
    if (tab === 'Заявки') {
        subTab = 'На рассмотрении';
    }
    updateContent();

    document.querySelectorAll('.tab').forEach(tabElement => tabElement.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
}

function setSubTab(tab) {
    subTab = tab;
    updateContent();

    document.querySelectorAll('.sub-tab').forEach(subTabElement => subTabElement.classList.remove('active'));
    document.querySelector(`.sub-tab[data-sub-tab="${tab}"]`).classList.add('active');
}

function toggleExpand(id) {
    Object.keys(requests).forEach(category => {
        const request = requests[category].find(req => req.id === id);
        if (request) {
            request.expanded = !request.expanded;
        }
    });

    updateContent();
}

function moveRequest(id, targetCategory) {
    Object.keys(requests).forEach(category => {
        const index = requests[category].findIndex(req => req.id === id);
        if (index !== -1) {
            const request = requests[category].splice(index, 1)[0];
            request.expanded = false; // Сбрасываем раскрытие при перемещении
            requests[targetCategory].push(request);
        }
    });

    updateContent();
}

function deleteRequest(id) {
    Object.keys(requests).forEach(category => {
        const index = requests[category].findIndex(req => req.id === id);
        if (index !== -1) {
            requests[category].splice(index, 1);  // Удаляем заявку
        }
    });

    updateContent();
}

function addModerator() {
    const email = document.getElementById('moderator-email').value;
    const name = document.getElementById('moderator-name').value;

    if (email && name) {
        moderators.push({ email, name });
        document.getElementById('moderator-email').value = '';
        document.getElementById('moderator-name').value = '';
        updateContent();
    }
}

function addNomination() {
    const nominationName = document.getElementById('nomination-name').value;

    if (nominationName) {
        nominations.push(nominationName);
        document.getElementById('nomination-name').value = '';
        updateContent();
    } else {
        alert('Пожалуйста, заполните поле с названием номинации.');
    }
}

function deleteNomination(index) {
    nominations.splice(index, 1); // Удаляем номинацию из массива
    updateContent(); // Обновляем список номинаций
}

function updateContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const subTabsContainer = document.getElementById('subTabs');
    subTabsContainer.style.display = selectedTab === 'Заявки' ? 'flex' : 'none';

    if (selectedTab === 'Заявки') {
        requests[subTab].forEach(request => {
            const div = document.createElement('div');
            div.classList.add('request');
            if (request.expanded) div.classList.add('expanded');
            div.id = `request-${request.id}`;

            div.innerHTML = `
                <div class="request-header">
                    <span><strong>${request.author}</strong> - ${request.title}</span>
                    <div class="buttons">
                        <button onclick="toggleExpand(${request.id})">${request.expanded ? 'Свернуть' : 'Развернуть'}</button>
                        ${subTab === 'На рассмотрении' ? `
                            <button onclick="moveRequest(${request.id}, 'Архив')">Архивировать</button>
                            <button onclick="moveRequest(${request.id}, 'Принятые')">Принять</button>
                            <button onclick="deleteRequest(${request.id})">Отклонить</button>
                        ` : ''}
                    </div>
                </div>
                <div class="details" style="display: ${request.expanded ? 'block' : 'none'};">
                    <p><strong>ФИО:</strong> ${request.author}</p>
                    <p><strong>Почта:</strong> ${request.email}</p>
                    <p><strong>Номинация:</strong> ${request.nomination}</p>
                    <p><strong>Название:</strong> ${request.title}</p>
                    <p><strong>Описание:</strong> ${request.description}</p>
                    <p><strong>Согласие:</strong> ${request.consent}</p>
                    <p><strong>Ссылки:</strong> <a href="${request.links}" target="_blank">${request.links}</a></p>
                </div>
            `;

            content.appendChild(div);
        });
    } else if (selectedTab === 'Модераторы') {
        // Добавляем форму для ввода данных модератора без фона
        const moderatorForm = document.createElement('div');
        moderatorForm.classList.add('request'); // Стиль заявки
        moderatorForm.classList.add('moderator-form');
        moderatorForm.style.backgroundColor = 'transparent'; // Убираем фон
        moderatorForm.innerHTML = `
            <input type="text" id="moderator-name" class="input-field" placeholder="Имя модератора" />
            <input type="email" id="moderator-email" class="input-field" placeholder="Почта модератора" />
            <button onclick="addModerator()">Добавить</button>
        `;
        content.appendChild(moderatorForm);

        // Добавляем список активных модераторов
        const moderatorsList = document.createElement('ul');
        moderatorsList.id = 'moderators-list';

        if (moderators.length > 0) {
            moderators.forEach((moderator, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${moderator.name} (${moderator.email})`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.onclick = () => deleteModerator(index);

                listItem.appendChild(deleteButton);
                moderatorsList.appendChild(listItem);
            });
        } else {
            moderatorsList.innerHTML = `<p>Нет активных модераторов</p>`;
        }

        content.appendChild(moderatorsList);
    } else if (selectedTab === 'Номинации') {
        // Добавляем форму для ввода новой номинации без фона
        const nominationForm = document.createElement('div');
        nominationForm.classList.add('request'); // Стиль заявки
        nominationForm.classList.add('moderator-form');
        nominationForm.style.backgroundColor = 'transparent'; // Убираем фон
        nominationForm.innerHTML = `
            <input type="text" id="nomination-name" class="input-field" placeholder="Название номинации" />
            <button onclick="addNomination()">Добавить</button>
        `;
        content.appendChild(nominationForm);

        // Добавляем список номинаций с кнопкой удаления
        const nominationsList = document.createElement('ul');
        nominationsList.id = 'nominations-list';

        if (nominations.length > 0) {
            nominations.forEach((nomination, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = nomination;

                // Добавляем кнопку для удаления номинации
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.onclick = () => deleteNomination(index);

                listItem.appendChild(deleteButton);
                nominationsList.appendChild(listItem);
            });
        } else {
            nominationsList.innerHTML = `<p>Нет номинаций</p>`;
        }

        content.appendChild(nominationsList);
    } else {
        content.innerHTML = `<p>Контент для вкладки "${selectedTab}"</p>`;
    }
}

function deleteModerator(index) {
    moderators.splice(index, 1); // Удаляем модератора из массива
    updateContent(); // Обновляем список
}
