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
    } else {
        content.innerHTML = `<p>Контент для вкладки "${selectedTab}"</p>`;
    }
}
