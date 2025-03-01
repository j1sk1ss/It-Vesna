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
    subTab = 'На рассмотрении'; // сбрасываем подзакладку при изменении вкладки
    updateContent();

    const subTabs = document.getElementById('subTabs');
    subTabs.style.display = selectedTab === 'Заявки' ? 'block' : 'none';

    document.querySelectorAll('.tab').forEach(tabElement => {
        tabElement.classList.remove('active');
    });

    const activeTab = document.querySelector(`.tab[data-tab="${selectedTab}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function setSubTab(tab) {
    subTab = tab;
    updateContent();

    document.querySelectorAll('.sub-tab').forEach(subTabElement => {
        subTabElement.classList.remove('active');
    });

    const activeSubTab = document.querySelector(`.sub-tab[data-sub-tab="${subTab}"]`);
    if (activeSubTab) {
        activeSubTab.classList.add('active');
    }
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
    content.innerHTML = '';  // Очистить содержимое

    if (selectedTab === 'Заявки') {
        let list = subTab === 'На рассмотрении' ? requests : subTab === 'Принятые' ? approveRequests : archRequests;
        list.forEach(request => {
            const div = document.createElement('div');
            div.classList.add('request');
            div.innerHTML = `
                <p>${request.title}</p>
                <p class="author">Автор: ${request.author}</p>
                <p class="status">Статус: ${subTab}</p>
                <button class="delete-button" onclick="handleDeleteRequest(${request.id}, '${subTab === 'На рассмотрении' ? 'requests' : subTab === 'Принятые' ? 'approveRequests' : 'archRequests'}')">Удалить</button>
            `;
            content.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTab('Заявки');
    setSubTab('На рассмотрении');
    updateContent();
});
