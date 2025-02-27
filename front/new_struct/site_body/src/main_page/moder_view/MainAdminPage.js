document.addEventListener("DOMContentLoaded", function () {
    const tabs = ["Главная", "Участие", "План мероприятий", "Положения конкурса", "Состав жюри", "Технические требования"];
    const tabContainer = document.getElementById("tab-container");
    const postInput = document.getElementById("post-input");
    const placeholder = document.getElementById("placeholder");
    const publishButton = document.getElementById("publish-button");
    const tabContent = document.getElementById("tab-content");

    let selectedTab = "Главная";
    let posts = {
        "Главная": [],
        "Участие": [],
        "План мероприятий": [],
        "Положения конкурса": [],
        "Состав жюри": [],
        "Технические требования": []
    };

    function renderTabs() {
        tabContainer.innerHTML = "";
        tabs.forEach(tabName => {
            const tab = document.createElement("div");
            tab.className = `tab ${selectedTab === tabName ? "active" : ""}`;
            tab.textContent = tabName;
            tab.onclick = () => {
                selectedTab = tabName;
                renderTabs();
                renderPosts();
            };
            tabContainer.appendChild(tab);
        });
    }

    function renderPosts() {
        tabContent.innerHTML = "";
        posts[selectedTab].forEach((post, index) => {
            const postElement = document.createElement("div");
            postElement.className = `post ${post.pinned ? "pinned" : ""}`;

            postElement.innerHTML = `
                <div class="post-info">
                    <div class="post-meta">
                        <div class="author">${post.author}</div>
                        <div class="date">${post.date}</div>
                        ${post.pinned ? '<div class="pinned-label">Закреплено</div>' : ""}
                    </div>
                    <img src="/more.png" class="more-button" data-index="${index}">
                </div>
                <div class="post-text">${post.text}</div>
            `;

            postElement.querySelector(".more-button").addEventListener("click", (event) => {
                showActions(event, index);
            });

            tabContent.appendChild(postElement);
        });
    }

    function handlePublish() {
        const text = postInput.innerText.trim();
        if (text !== "") {
            posts[selectedTab].unshift({
                text,
                author: "Модератор",
                date: new Date().toLocaleDateString(),
                pinned: false
            });
            postInput.innerText = "";
            placeholder.style.display = "block";
            renderPosts();
        }
    }

    function showActions(event, index) {
        const menu = document.createElement("div");
        menu.className = "actions-popup";
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;

        menu.innerHTML = `
            <button onclick="deletePost(${index})">Удалить</button>
            <button onclick="pinPost(${index})">Закрепить</button>
            <button onclick="editPost(${index})">Редактировать</button>
        `;

        document.body.appendChild(menu);
        document.addEventListener("click", () => menu.remove(), { once: true });
    }

    window.deletePost = function (index) {
        posts[selectedTab].splice(index, 1);
        renderPosts();
    };

    window.pinPost = function (index) {
        const pinnedPost = posts[selectedTab].splice(index, 1)[0];
        posts[selectedTab].unshift({ ...pinnedPost, pinned: true });
        renderPosts();
    };

    window.editPost = function (index) {
        postInput.innerText = posts[selectedTab][index].text;
        posts[selectedTab].splice(index, 1);
        placeholder.style.display = "none";
        renderPosts();
    };

    postInput.addEventListener("input", () => {
        placeholder.style.display = postInput.innerText.trim() ? "none" : "block";
    });

    publishButton.addEventListener("click", handlePublish);
    renderTabs();
    renderPosts();
});
