async function sendRequest() {
    const authors  = Array.from(document.querySelectorAll("#authors-list .item span")).map(span => span.textContent);
    const links    = Array.from(document.querySelectorAll("#links-list .item span a")).map(a => a.textContent);
    const ageGroup = document.getElementById("age-group").value;
    const email    = document.querySelector("input[type='email']").value;
    const nomination  = document.getElementById("nomination").value;
    const institution = document.querySelector("input[placeholder='Учреждение']").value;
    const projectName = document.querySelector("input[placeholder='Название проекта']").value;
    const fileInput   = document.getElementById("file-upload");
    const projectDescription = document.getElementById("description").value;
    const consentFileInput   = document.getElementById("file-upload");
    if (!projectName || !projectDescription || !email || !nomination || !institution || authors.length === 0) {
        alert("Заполните все обязательные поля!");
        return;
    }

    const formData = new FormData();
    formData.append("project_name", projectName);
    formData.append("email", email);
    formData.append("nomination", nomination);
    formData.append("institution", institution);
    formData.append("age_group", ageGroup);
    
    if (consentFileInput.files.length > 0) {
        formData.append("consent_file", consentFileInput.files[0]);
    } else {
        alert("Файл согласия обязателен!");
        return;
    }

    authors.forEach(author => formData.append("authors[]", author));
    links.forEach(link => formData.append("links[]", link));

    const descriptionBlob = new Blob([projectDescription], { type: "text/plain" });
    formData.append("description", descriptionBlob, "description.txt");
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    }

    try {
        const response = await fetch("/api/send_request", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert("Заявка успешно отправлена!");
        } else {
            alert("Ошибка при отправке заявки: " + data.error);
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке заявки.");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const linkInput     = document.getElementById("link-input");
    const addLinkButton = document.getElementById("add-link-button");
    const linksList     = document.getElementById("links-list");
    const authorInput   = document.getElementById("author-input");
    const authorsList   = document.getElementById("authors-list");
    const description   = document.getElementById("description");
    const addAuthorButton = document.getElementById("add-author-button");

    function addItem(inputElement, listElement, isLink = false) {
        const value = inputElement.value.trim();
        if (value) {
            const item = document.createElement("div");
            item.className = "item";

            if (isLink) {
                item.innerHTML = `
                    <span><a href="${value}" target="_blank">${value}</a></span>
                    <button class="delete-btn">-</button>
                `;
            } else {
                item.innerHTML = `
                    <span>${value}</span>
                    <button class="delete-btn">-</button>
                `;
            }

            listElement.appendChild(item);
            inputElement.value = "";
            
            item.querySelector(".delete-btn").addEventListener("click", () => {
                listElement.removeChild(item);
            });
        }
    }

    addLinkButton.addEventListener("click", () => {
        addItem(linkInput, linksList, true);
    });

    addAuthorButton.addEventListener("click", () => {
        addItem(authorInput, authorsList, false);
    });

    description.addEventListener("input", () => {
        description.style.height = "auto";
        description.style.height = (description.scrollHeight) + "px";
    });

    document.querySelectorAll('.select-box').forEach(function(selectBox, index) {
        selectBox.addEventListener('click', function() {
            var customSelect = this.closest('.custom-select');
            customSelect.classList.toggle('open');
            document.querySelectorAll('.custom-select').forEach(function(otherSelect) {
                if (otherSelect !== customSelect) {
                    otherSelect.classList.remove('open');
                    setTimeout(function() {
                        otherSelect.style.zIndex = '';
                    }, 300);
                }
            });
    
            if (customSelect.classList.contains('open')) {
                customSelect.style.zIndex = 10 + index;
            } else {
                setTimeout(function() {
                    customSelect.style.zIndex = '';
                }, 300);
            }
        });
    });
    
    document.querySelectorAll('.options-list li').forEach(function(option) {
        option.addEventListener('click', function() {
            var selectedOption = this.textContent;
            var customSelect = this.closest('.custom-select');
            customSelect.querySelector('.selected-option').textContent = selectedOption;
            customSelect.classList.remove('open');
            setTimeout(function() {
                customSelect.style.zIndex = '';
            }, 300);
        });
    });
    
    document.getElementById('file-upload').addEventListener('change', function(event) {
        const fileName = event.target.files[0] ? event.target.files[0].name : 'Прикрепите согласие';
        document.querySelector('.file-name').textContent = fileName;
    });      
});
