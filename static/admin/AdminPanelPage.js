let selectedTab = 'Заявки';
let subTab = 'На рассмотрении';
let moderators = [];
let nominations = ['Номинация 1', 'Номинация 2', 'Номинация 3'];

const requests = [
    { id: 1, author: 'Автор 1', title: 'Заявка 1' },
    { id: 2, author: 'Автор 2', title: 'Заявка 2' }
];
const approveRequests = [];
const archRequests = [];

function setTab(tab) {
    selectedTab = tab;
    subTab = 'На рассмотрении';
    updateContent();

    const rightTabContainer = document.querySelector('.adminp-right-tab-container');
    rightTabContainer.style.display = selectedTab === 'Заявки' ? 'flex' : 'none';

    const moderatorInputContainer = document.querySelector('.moder-create-container');
    moderatorInputContainer.style.display = selectedTab === 'Модераторы' ? 'block' : 'none';

    const nominationInputContainer = document.querySelector('.nomination-create-container');
    nominationInputContainer.style.display = selectedTab === 'Номинации' ? 'block' : 'none';
}

function setSubTab(tab) {
    subTab = tab;
    updateContent();
}

function handleCreateModerator() {
    const email = document.getElementById('moderatorEmail').value;
    const name = document.getElementById('moderatorName').value;
    if (email && name) {
        moderators.push({ email, name });
        document.getElementById('moderatorEmail').value = '';
        document.getElementById('moderatorName').value = '';
        updateContent();
    }
}

function handleDeleteModerator(index) {
    moderators.splice(index, 1);
    updateContent();
}

function handleAddNomination() {
    const nomination = document.getElementById('nominationName').value.trim();
    if (nomination) {
        nominations.push(nomination);
        document.getElementById('nominationName').value = '';
        updateContent();
    }
}

function handleDeleteNomination(index) {
    nominations.splice(index, 1);
    updateContent();
}

function handleDeleteRequest(id, list) {
    const index = list.findIndex(request => request.id === id);
    if (index !== -1) {
        list.splice(index, 1);
        updateContent();
    }
}

document.addEventListener("visibilitychange", function() {
    const content = document.getElementById('content');
    content.style.display = document.hidden ? 'none' : 'block';
    if (!document.hidden) updateContent();
});

function updateContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (selectedTab === 'Заявки') {
        let list = subTab === 'На рассмотрении' ? requests : subTab === 'Принятые' ? approveRequests : archRequests;
        content.innerHTML = list.map(request => `
            <div class="request1">
                <div class="request-info">
                    <div>${request.author}</div>
                    <div>${request.title}</div>
                </div>
                <div class="request-buttons">
                    <button class="delete-button" onclick="handleDeleteRequest(${request.id}, '${subTab === 'На рассмотрении' ? 'requests' : subTab === 'Принятые' ? 'approveRequests' : 'archRequests'}')">Удалить</button>
                </div>
            </div>
        `).join('');
    } else if (selectedTab === 'Модераторы') {
        content.innerHTML = moderators.map((moderator, index) => `
            <div class="request1">
                <div class="request-info">
                    <div>${moderator.name}</div>
                    <div>${moderator.email}</div>
                </div>
                <div class="request-buttons">
                    <button class="delete-button" onclick="handleDeleteModerator(${index})">Удалить</button>
                </div>
            </div>
        `).join('');
    } else if (selectedTab === 'Номинации') {
        content.innerHTML = nominations.map((nomination, index) => `
            <div class="request1">
                <div class="request-info">${nomination}</div>
                <div class="request-buttons">
                    <button class="delete-button" onclick="handleDeleteNomination(${index})">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTab('Заявки'); // Устанавливаем активный таб "Заявки" при загрузке страницы
    updateContent();
});
