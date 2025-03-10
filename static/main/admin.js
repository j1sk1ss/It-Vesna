document.addEventListener("DOMContentLoaded", function () {
    const postInput = document.getElementById("post-input");
    const placeholder = document.getElementById("placeholder");
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
        const tabContent = document.getElementById("tab-content-container");
        tabContent.innerHTML = "";

        if (currentPosts.length === 0) {
            tabContent.innerHTML = "<p>Нет постов для отображения.</p>";
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
                            <img class="post-pin-button" data-index="${index}" src="/static/public/pin.png" alt="Закрепить">
                            <img class="post-edit-button" data-index="${index}" src="/static/public/edit.png" alt="Редактировать">
                            <img class="post-delete-button" data-index="${index}" src="/static/public/delete.png" alt="Удалить">
                        </div>
                    </div>
                    <div class="post-body">${post.content}</div>
                `;

                postContainer.appendChild(postContentContainer);
                tabContent.appendChild(postContainer);
            });
            addEventListeners();
        }
    }

    function addEventListeners() {
        document.querySelectorAll(".post-pin-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                posts[selectedTab][index].pinned = !posts[selectedTab][index].pinned;
                posts[selectedTab].sort((a, b) => (b.pinned === true) - (a.pinned === true));
                renderPosts();
            });
        });

        document.querySelectorAll(".post-edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                postInput.innerHTML = posts[selectedTab][index].content;
                placeholder.style.display = "none";
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
                button.style.filter = "brightness(0) saturate(100%) invert(59%) sepia(22%) saturate(790%) hue-rotate(53deg) brightness(90%) contrast(95%)";
            } else {
                button.style.filter = "none";
            }
        });
    }

    publishButton.addEventListener("click", function () {
        const content = postInput.innerHTML.trim();
        if (content !== "" && content !== placeholder.textContent) {
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

            postInput.innerHTML = "";
            placeholder.style.display = "block";
            renderPosts();
        }
    });

    postInput.addEventListener("input", function () {
        placeholder.style.display = postInput.innerHTML.trim() === "" ? "block" : "none";
    });

    renderTabs();
    renderPosts();
});
