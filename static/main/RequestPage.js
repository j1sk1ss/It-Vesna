document.addEventListener("DOMContentLoaded", () => {
    const fileUpload = document.getElementById("file-upload");
    const fileBox = document.querySelector(".rg-box");
    const linkInput = document.getElementById("link-input");
    const addLinkButton = document.getElementById("add-link-button");
    const linksList = document.getElementById("links-list");
    const description = document.getElementById("description");

    // Обработка загрузки файла
    fileUpload.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
            fileBox.style.background = "linear-gradient(45deg, darkgreen, green)";
        } else {
            fileBox.style.background = "linear-gradient(45deg, darkred, red)";
        }
    });

    // Добавление ссылки
    addLinkButton.addEventListener("click", () => {
        const linkValue = linkInput.value.trim();
        if (linkValue) {
            const linkElement = document.createElement("div");
            linkElement.className = "link";
            linkElement.innerHTML = `
                <div class="link-text">
                    <a href="${linkValue}" target="_blank">${linkValue}</a>
                </div>
                <button class="delete-button1">Удалить</button>
            `;

            linksList.appendChild(linkElement);
            linkInput.value = "";

            linkElement.querySelector(".delete-button1").addEventListener("click", () => {
                linksList.removeChild(linkElement);
            });
        }
    });

    // Обработка ввода в описание
    description.addEventListener("input", () => {
        if (description.textContent.trim()) {
            description.classList.remove("placeholder");
        } else {
            description.classList.add("placeholder");
        }
    });
});
