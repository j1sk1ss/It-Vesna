document.addEventListener("DOMContentLoaded", () => {
    const linkInput = document.getElementById("link-input");
    const addLinkButton = document.getElementById("add-link-button");
    const linksList = document.getElementById("links-list");
    const authorInput = document.getElementById("author-input");
    const addAuthorButton = document.getElementById("add-author-button");
    const authorsList = document.getElementById("authors-list");
    const description = document.getElementById("description");

    // Функция для добавления элементов в список
    function addItem(inputElement, listElement, isLink = false) {
        const value = inputElement.value.trim();
        if (value) {
            const item = document.createElement("div");
            item.className = "item";

            if (isLink) {
                // Добавляем ссылку, которая будет кликабельной
                item.innerHTML = `
                    <span><a href="${value}" target="_blank">${value}</a></span>
                    <button class="delete-btn">Удалить</button>
                `;
            } else {
                // Добавляем автора как обычный текст
                item.innerHTML = `
                    <span>${value}</span>
                    <button class="delete-btn">Удалить</button>
                `;
            }

            listElement.appendChild(item);
            inputElement.value = ""; // Очищаем поле ввода

            // Добавляем обработчик на кнопку удаления
            item.querySelector(".delete-btn").addEventListener("click", () => {
                listElement.removeChild(item); // Удаляем элемент
            });
        }
    }

    // Обработчики событий
    addLinkButton.addEventListener("click", () => {
        addItem(linkInput, linksList, true); // Передаем true для ссылок
    });

    addAuthorButton.addEventListener("click", () => {
        addItem(authorInput, authorsList, false); // Передаем false для авторов
    });

    // Автоматическое расширение поля для описания
    description.addEventListener("input", () => {
        description.style.height = "auto"; // Сбросить высоту
        description.style.height = (description.scrollHeight) + "px"; // Установить высоту равной контенту
    });
});
