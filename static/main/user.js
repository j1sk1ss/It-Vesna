document.addEventListener("DOMContentLoaded", function () {
    const posts = {
        'Участие': [],
        'План мероприятий': [],
        'Положения конкурса': [],
        'Состав жюри': [],
        'Технические требования': []
    };

    let selectedTab = "Участие";
    const tabsContainer = document.getElementById("tabs");
    const tabContent = document.getElementById("tab-content");

    function renderTabs() {
        const tabs = Object.keys(posts);
        const tabContainer = document.getElementById("tab-container");
        tabContainer.innerHTML = "";
        tabs.forEach(tab => {
            const tabElement = document.createElement("span");
            tabElement.classList.add("tab");
            if (tab === selectedTab) {
                tabElement.classList.add("active");
            }
            tabElement.textContent = tab;
            tabElement.addEventListener("click", function () {
                selectedTab = tab;
                renderTabs();
                renderPosts();
            });
            tabContainer.appendChild(tabElement);
        });
    }

    // Функция для выбора вкладки
    function selectTab(tabName) {
        selectedTab = tabName;
        renderTabs();  // Обновляем вкладки, чтобы выделить активную
        updateTabContent();
    }

    // Функция для обновления контента вкладки
    function updateTabContent() {
        let message = '';
        const postsList = posts[selectedTab];

        // Если посты есть, показываем их
        if (postsList.length > 0) {
            message = '<ul>';
            postsList.forEach(post => {
                message += `<li>${post.title}: ${post.content}</li>`;
            });
            message += '</ul>';
        } else {
            message = 'Здесь нет постов.';
        }

        tabContent.innerHTML = `<h2>${selectedTab}</h2><div>${message}</div>`;
    }

    // Функция для загрузки постов с сервера
    async function fetchPosts() {
        try {
            const response = await fetch('/api/getPosts'); // Замените на реальный путь к вашему API
            if (response.ok) {
                const data = await response.json();

                // Обработка полученных данных
                Object.keys(posts).forEach(tabName => {
                    if (data[tabName]) {
                        posts[tabName] = data[tabName];
                    }
                });

                // Обновляем контент для текущей вкладки
                updateTabContent();
            } else {
                console.error('Ошибка при загрузке данных');
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
        }
    }

    // Инициализация
    renderTabs();
    fetchPosts(); // Загружаем посты с сервера
});
