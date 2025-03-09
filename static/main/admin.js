let selectedTab = "Участие"; // Default tab

// Тестовая функция для имитации получения постов
async function getPosts(category) {
    return [
        {
            id: 1,
            title: "Тестовый пост 1",
            content: "Это содержание поста.",
            category: category || "Общее",
            author: "Иван Иванов",
            date: "2025-03-09T10:00:00"
        },
        {
            id: 2,
            title: "Тестовый пост 2",
            content: "Это содержание второго поста.",
            category: category || "Общее",
            author: "Анна Петрова",
            date: "2025-03-10T11:00:00"
        }
    ];
}


async function pinPost(id) {
    // Симуляция закрепления поста
    console.log(`Пост с id ${id} закреплен.`);
}

async function deletePost(id) {
    // Симуляция удаления поста
    console.log(`Пост с id ${id} удален.`);
}

async function addPost(author, category, content) {
    // Симуляция добавления поста
    console.log(`Добавлен новый пост от ${author} в категорию ${category}`);
}

// Функция для рендеринга постов
async function renderPosts() {
    const currentPosts = await getPosts(selectedTab);
    const tabContent = document.getElementById("tab-content-container");

    tabContent.innerHTML = ""; // Очищаем контейнер постов

    if (currentPosts.length === 0) {
        tabContent.innerHTML = "<p>No posts available</p>"; // Show message if no posts
    } else {
        currentPosts.forEach((post) => {
            const postElement = document.createElement("li");
            postElement.classList.add("post-container");

            const postContentContainer = document.createElement("div");
            postContentContainer.classList.add("post");

            const formattedDate = new Date(post.date).toLocaleDateString("ru-RU", {
                year: "numeric", month: "2-digit", day: "2-digit"
            }) + ", " + new Date(post.date).toLocaleTimeString("ru-RU");

            postContentContainer.innerHTML = `
            <div class="post-header">
                <div class="post-header-left">
                    <span class="post-author">Автор: ${post.author}</span>
                    <span class="post-date">${formattedDate}</span>
                </div>
                <div class="post-header-right">
                    <img class="post-pin-button" data-index="${post.id}" src="/static/public/pin.png" alt="Закрепить">
                    <img class="post-edit-button" data-index="${post.id}" src="/static/public/edit.png" alt="Редактировать">
                    <img class="post-delete-button" data-index="${post.id}" src="/static/public/delete.png" alt="Удалить">
                </div>
            </div>
            <div class="post-body">${post.content}</div>
        `;
        

            // Обработчики событий для кнопок
            postContentContainer.querySelector(".post-pin-button").addEventListener("click", async () => {
                await pinPost(post.id);
                await renderPosts(); // Обновить посты после закрепления
            });

            postContentContainer.querySelector(".post-edit-button").addEventListener("click", async () => {
                console.log("Редактирование поста с id", post.id);
                await renderPosts(); // Обновить посты после редактирования
            });

            postContentContainer.querySelector(".post-delete-button").addEventListener("click", async () => {
                await deletePost(post.id);
                await renderPosts(); // Обновить посты после удаления
            });

            postElement.appendChild(postContentContainer);  // Добавить пост в список
            tabContent.appendChild(postElement);  // Добавить элемент в контейнер постов
        });
    }
}



// Рендеринг вкладок динамически
document.addEventListener("DOMContentLoaded", async function () {
    const postInput = document.getElementById("post-input");
    const placeholder = document.getElementById("placeholder");
    const publishButton = document.getElementById("publish-button");

    async function renderTabs() {
        const tabs = ["Участие", "План мероприятий", "Положения конкурса", "Состав жюри", "Технические требования"];
        const tabContainer = document.getElementById("tab-container");
        tabContainer.innerHTML = ""; // Очистить существующие вкладки

        tabs.forEach(tab => {
            const tabElement = document.createElement("span");
            tabElement.classList.add("tab");
            if (tab === selectedTab) {
                tabElement.classList.add("active");
            }

            tabElement.textContent = tab;
            tabElement.addEventListener("click", async function () {
                selectedTab = tab;
                renderTabs();
                await renderPosts();
            });

            tabContainer.appendChild(tabElement); // Добавить вкладку в контейнер
        });
    }

    // Обработчик клика по кнопке публикации
    publishButton.addEventListener("click", async function () {
        const content = postInput.innerHTML.trim();
        if (content !== "" && content !== placeholder.textContent) {
            await addPost("test", selectedTab, content); // Добавление поста с тестовыми данными
            await renderPosts();
        }
    });

    // Показать/скрыть плейсхолдер в зависимости от содержимого поля
    postInput.addEventListener("input", function () {
        if (postInput.innerHTML.trim() === "") {
            placeholder.style.display = "block";
        } else {
            placeholder.style.display = "none";
        }
    });

    renderTabs(); // Отображаем вкладки при загрузке страницы
    await renderPosts(); // Отображаем посты по умолчанию
});
