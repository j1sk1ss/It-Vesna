document.addEventListener("DOMContentLoaded", function () {
    const postInput = document.getElementById("post-input");
    const placeholder = document.getElementById("placeholder");
    const publishButton = document.getElementById("publish-button");
    const tabContentContainer = document.getElementById("tab-content-container");

    let selectedTab = "Участие";  // Стартовая вкладка
    const posts = {
        "Участие": [],
        "План мероприятий": [],
        "Положения конкурса": [],
        "Состав жюри": [],
        "Технические требования": []
    };

    let editingPostIndex = null;  // Индекс редактируемого поста

    // Рендеринг вкладок
    function renderTabs() {
        const tabs = ["Участие", "План мероприятий", "Положения конкурса", "Состав жюри", "Технические требования"];
        const tabContainer = document.getElementById("tab-container");
        tabContainer.innerHTML = "";  // Очистить вкладки
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

    // Рендеринг постов
    function renderPosts() {
        const currentPosts = posts[selectedTab];
        const tabContent = document.getElementById("tab-content-container");

        // Очищаем текущий контент вкладки перед рендерингом новых постов
        tabContent.innerHTML = "";

        if (currentPosts.length === 0) {
            tabContent.innerHTML = "<p>Нет постов для отображения.</p>";
        } else {
            currentPosts.forEach((post, index) => {
                // Обертка для каждого поста
                const postContainer = document.createElement("div");
                postContainer.classList.add("post-container");

                // Внутренний контейнер поста
                const postContentContainer = document.createElement("div");
                    postContentContainer.classList.add("post");
                    postContentContainer.innerHTML = `
                        <div class="post-header">
                           <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
                            <div class="post-buttons">
                                <img class="post-pin-button" data-index="${index}" src="/static/public/pin.png" alt="Закрепить">
                                <img class="post-edit-button" data-index="${index}" src="/static/public/edit.png" alt="Редактировать">
                                <img class="post-delete-button" data-index="${index}" src="/static/public/delete.png" alt="Удалить">
                            </div>
                        </div>
                        <div class="post-body">${post.content}</div>
                    `;

                // Добавляем обработчики событий
                postContentContainer.querySelector(".post-pin-button").addEventListener("click", () => pinPost(index));
                postContentContainer.querySelector(".post-edit-button").addEventListener("click", () => editPost(index));
                postContentContainer.querySelector(".post-delete-button").addEventListener("click", () => deletePost(index));

                // Добавляем пост в контейнер
                postContainer.appendChild(postContentContainer);
                tabContent.appendChild(postContainer);
            });

            // Добавляем обработчики для кнопок
            const pinButtons = document.querySelectorAll(".post-pin-button");
            const editButtons = document.querySelectorAll(".post-edit-button");
            const deleteButtons = document.querySelectorAll(".post-delete-button");

            pinButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const index = button.getAttribute("data-index");
                    // Переносим пост в начало списка
                    const pinnedPost = posts[selectedTab].splice(index, 1)[0];
                    posts[selectedTab].unshift(pinnedPost);
                    renderPosts();
                });
            });

            editButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const index = button.getAttribute("data-index");
                    // Заполняем поле ввода содержимым поста для редактирования
                    postInput.innerHTML = posts[selectedTab][index].content;
                    placeholder.style.display = "none"; // Прячем placeholder
                    editingPostIndex = index; // Сохраняем индекс редактируемого поста
                    // Удаляем пост из списка, чтобы его заменить
                    posts[selectedTab].splice(index, 1);
                    renderPosts();
                });
            });

            deleteButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const index = button.getAttribute("data-index");
                    posts[selectedTab].splice(index, 1);
                    renderPosts();
                });
            });
        }
    }

    // Функция для публикации нового или отредактированного поста
    publishButton.addEventListener("click", function () {
        const content = postInput.innerHTML.trim();
        if (content !== "" && content !== placeholder.textContent) {
            const newPost = {
                content: content,
                timestamp: Date.now()
            };

            if (editingPostIndex !== null) {
                // Если редактируется пост, обновляем его на старой позиции
                posts[selectedTab][editingPostIndex] = newPost;
                editingPostIndex = null; // Сбрасываем индекс редактируемого поста
            } else {
                // Если новый пост, добавляем его в начало списка
                posts[selectedTab].unshift(newPost);
            }

            // Очищаем поле ввода и показываем placeholder
            postInput.innerHTML = "";
            placeholder.style.display = "block";  // Показать placeholder
            renderPosts();
        }
    });

    // Проверка пустоты поля ввода
    postInput.addEventListener("input", function () {
        if (postInput.innerHTML.trim() === "") {
            placeholder.style.display = "block";
        } else {
            placeholder.style.display = "none";
        }
    });

    // Инициализация страницы
    renderTabs();
    renderPosts();
});
