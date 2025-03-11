document.addEventListener("DOMContentLoaded", function () {
    const postInput = document.getElementById("post-input");
    const publishButton = document.getElementById("publish-button");
    const tabContentContainer = document.getElementById("tab-content-container");

    let selectedTab = "Участие";
    const posts = {
        "Участие": [],
        "План мероприятий": [],
        "Положения конкурса": [],
        "Состав жюри": [],
        "Технические требования": []
    };

    let editingPostIndex = null;
    const adminName = "Администратор";

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

    function renderPosts() {
        const currentPosts = posts[selectedTab];
        tabContentContainer.innerHTML = "";

        if (currentPosts.length === 0) {
            tabContentContainer.innerHTML = "<p>Нет постов для отображения.</p>";
        } else {
            currentPosts.forEach((post, index) => {
                const postContainer = document.createElement("div");
                postContainer.classList.add("post-container");

                const postContentContainer = document.createElement("div");
                postContentContainer.classList.add("post");
                postContentContainer.innerHTML = `
                    <div class="post-header">
                        <span class="post-admin"><strong>${post.admin}</strong></span>
                        <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
                        <div class="post-buttons">
                            <img class="post-pin-button ${post.pinned ? "pinned" : ""}" data-index="${index}" src="/static/public/pin.png" alt="Закрепить">
                            <img class="post-edit-button" data-index="${index}" src="/static/public/edit.png" alt="Редактировать">
                            <img class="post-delete-button" data-index="${index}" src="/static/public/delete.png" alt="Удалить">
                        </div>
                    </div>
                    <div class="post-body">${post.content}</div>
                `;

                postContainer.appendChild(postContentContainer);
                tabContentContainer.appendChild(postContainer);
            });
            addEventListeners();
        }
    }

    function addEventListeners() {
        document.querySelectorAll(".post-pin-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"), 10);
                const post = posts[selectedTab][index];

                post.pinned = !post.pinned;

                if (post.pinned) {
                    // Убираем пост из текущего места
                    posts[selectedTab].splice(index, 1);
                    // Вставляем в самое начало списка закрепленных
                    posts[selectedTab].unshift(post);
                } else {
                    // Отмена закрепления — перемещаем пост в конец списка
                    posts[selectedTab].splice(index, 1);
                    posts[selectedTab].push(post);
                }

                renderPosts();
            });
        });

        document.querySelectorAll(".post-edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                postInput.value = posts[selectedTab][index].content;
                editingPostIndex = index;
            });
        });

        document.querySelectorAll(".post-delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                posts[selectedTab].splice(index, 1);
                renderPosts();
            });
        });

        highlightPinnedPosts();
    }

    function highlightPinnedPosts() {
        document.querySelectorAll(".post-pin-button").forEach((button, index) => {
            if (posts[selectedTab][index].pinned) {
                button.classList.add("pinned");
            } else {
                button.classList.remove("pinned");
            }
        });
    }

    publishButton.addEventListener("click", function () {
        const content = postInput.value.trim();
        if (content !== "") {
            const newPost = {
                content: content,
                timestamp: Date.now(),
                admin: adminName,
                pinned: false
            };

            if (editingPostIndex !== null) {
                posts[selectedTab][editingPostIndex] = newPost;
                editingPostIndex = null;
            } else {
                posts[selectedTab].unshift(newPost);
            }

            postInput.value = "";
            renderPosts();
        }
    });

    renderTabs();
    renderPosts();
});
