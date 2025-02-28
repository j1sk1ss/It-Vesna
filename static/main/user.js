document.addEventListener("DOMContentLoaded", function () {
    const posts = {
        'Участие': [],
        'План мероприятий': [],
        'Положения конкурса': [],
        'Состав жюри': [],
        'Технические требования': []
    };

    let selectedTab = "Главная";

    const tabsContainer = document.getElementById("tabs");
    const tabContent = document.getElementById("tab-content");

    function renderTabs() {
        tabsContainer.innerHTML = "";
        Object.keys(posts).forEach(tabName => {
            const tabElement = document.createElement("div");
            tabElement.className = `tab ${selectedTab === tabName ? "active" : ""}`;
            tabElement.textContent = tabName;
            tabElement.onclick = () => selectTab(tabName);
            tabsContainer.appendChild(tabElement);
        });
    }

    function selectTab(tabName) {
        selectedTab = tabName;
        renderTabs();
        updateTabContent();
    }

    function updateTabContent() {
        tabContent.innerHTML = `<h2>${selectedTab}</h2><p>Контент для вкладки "${selectedTab}" пока не добавлен.</p>`;
    }

    renderTabs();
    updateTabContent();
});
