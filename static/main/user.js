let selectedTab = "Участие";
let posts = {
    "Участие": [],
    "План мероприятий": [],
    "Положения конкурса": [],
    "Состав жюри": [],
    "Технические требования": []
};

async function getPosts(category) {
    try {
        const response = await fetch(`/api/posts?category=${category}`);
        if (!response.ok) {
            throw new Error('Ошибка при получении постов');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function selectTab(tabName) {
    selectedTab = tabName;
    renderPosts();
}

async function renderPosts() {
    const currentPosts = await getPosts(selectedTab);
    const tabContent = document.getElementById("tab-content-container");

    tabContent.innerHTML = "";
    if (currentPosts.length !== 0) {
        currentPosts.forEach((post) => {
            const postContainer = document.createElement("div");
            postContainer.classList.add("post-container");

            const postContentContainer = document.createElement("div");
            postContentContainer.classList.add("post");
            fetch(post.content_path)
            .then(response => response.text())
            .then(text => {
                postContentContainer.innerHTML = `
                <div class="post-header">
                    <span class="post-date">${new Date(post.created_at).toLocaleString()}</span>
                </div>
                <div class="post-body">${text}</div>
                `;

                postContainer.appendChild(postContentContainer);
                tabContent.appendChild(postContainer);
            })
            .catch(() => {
                
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const tabContent = document.getElementById("tab-content");
    function renderTabs() {
        const tabs = Object.keys(posts);
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
        });
    }

    // Функция для загрузки постов с сервера
    async function fetchPosts() {
        try {
            posts = {
                'Участие': getPosts("Участие"),
                'План мероприятий': getPosts("План мероприятий"),
                'Положения конкурса': getPosts("Положения конкурса"),
                'Состав жюри': getPosts("Состав жюри"),
                'Технические требования': getPosts("Технические требования")
            };
        } catch (error) {
            console.error('Ошибка запроса:', error);
        }
    }

    renderTabs();
    fetchPosts();
});
