let selectedTab = "Участие";
const posts = {
    "Участие": [],
    "План мероприятий": [],
    "Положения конкурса": [],
    "Состав жюри": [],
    "Технические требования": []
};


async function pinPost(id) {
    try {
        const response = await fetch(`/api/posts/${id}/pin`, {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem("key")
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при закреплении поста');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

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

async function deletePost(id) {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem("key")
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при удалении поста');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function addPost(author, category, content) {
    try {
        const formData = new FormData();
        const file = new Blob([content], { type: "text/plain" });
        formData.append("author", author);
        formData.append("category", category);
        formData.append("content", file, "content.txt");

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": localStorage.getItem("key")
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при добавлении поста');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
    }
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
                    <div class="post-buttons">
                        <img class="post-pin-button" data-index="${post.id}" src="/static/public/pin.png" alt="Закрепить">
                        <img class="post-edit-button" data-index="${post.id}" src="/static/public/edit.png" alt="Редактировать">
                        <img class="post-delete-button" data-index="${post.id}" src="/static/public/delete.png" alt="Удалить">
                    </div>
                </div>
                <div class="post-body">${text}</div>
                `;

                postContentContainer.querySelector(".post-pin-button").addEventListener("click", async () => {
                    await pinPost(post.id); 
                    await renderPosts();
                });

                postContentContainer.querySelector(".post-edit-button").addEventListener("click", async () => {
                    await editPost(post.id); 
                    await renderPosts();
                });

                postContentContainer.querySelector(".post-delete-button").addEventListener("click", async () => {
                    await deletePost(post.id); 
                    await renderPosts();
                });

                postContainer.appendChild(postContentContainer);
                tabContent.appendChild(postContainer);
            })
            .catch(() => {
                
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const postInput = document.getElementById("post-input");
    const publishButton = document.getElementById("publish-button");

    async function renderTabs() {
        const tabs = ["Участие", "План мероприятий", "Положения конкурса", "Состав жюри", "Технические требования"];
        const tabContainer = document.getElementById("tab-container");
        tabContainer.innerHTML = "";
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

            tabContainer.appendChild(tabElement);
        });
    }

    publishButton.addEventListener("click", async function () {
        const content = postInput.value.trim();
        if (content !== "") {
            await addPost(localStorage.getItem("name"), selectedTab, content);
            await renderPosts();
        }
    });

    renderTabs();
    await renderPosts();
});