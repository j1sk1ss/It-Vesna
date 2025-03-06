document.addEventListener("DOMContentLoaded", function () {
    const posts = {
        'Участие': [],
        'План мероприятий': [],
        'Положения конкурса': [],
        'Состав жюри': [],
        'Технические требования': []
    };

    let selectedTab = "Участие";  // Стартовая вкладка

    const tabsContainer = document.getElementById("tabs");
    const tabContent = document.getElementById("tab-content");

    // Рендеринг вкладок
    function renderTabs() {
        tabsContainer.innerHTML = "";  // Очистить вкладки
        Object.keys(posts).forEach(tabName => {
            const tabElement = document.createElement("div");
            tabElement.className = `tab ${selectedTab === tabName ? "active" : ""}`;  // Применяем активный класс
            tabElement.textContent = tabName;
            tabElement.onclick = () => selectTab(tabName);  // Обработчик клика по вкладке
            tabsContainer.appendChild(tabElement);
        });
    }

    // Обработчик выбора вкладки
    function selectTab(tabName) {
        selectedTab = tabName;
        renderTabs();  // Обновить активную вкладку
        updateTabContent();  // Обновить контент для выбранной вкладки
    }

    // Обновление контента вкладки
    function updateTabContent() {
        let message = '';
        
        switch(selectedTab) {
            case 'Участие':
                message = 'Это страница "Участие". Здесь будет информация о том, как принять участие.';
                break;
            case 'План мероприятий':
                message = 'Это страница "План мероприятий". Здесь будет отображаться план мероприятий.';
                break;
            case 'Положения конкурса':
                message = 'Это страница "Положения конкурса". Здесь будет информация о правилах конкурса.';
                break;
            case 'Состав жюри':
                message = 'Это страница "Состав жюри". Здесь будет информация о составе жюри.';
                break;
            case 'Технические требования':
                message = 'Это страница "Технические требования". Здесь будет информация о технических требованиях.';
                break;
            default:
                message = 'Выберите вкладку.';
        }

        tabContent.innerHTML = `<h2>${selectedTab}</h2><p>${message}</p>`;
    }

    renderTabs();  // Инициализируем вкладки
    updateTabContent();  // Инициализируем контент
});
