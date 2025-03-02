async function sendRequest() {
    const ageGroup = document.querySelector(".custom-select #age-group").textContent;
    const nomination = document.querySelector(".custom-select #nomination").textContent;

    const authors  = Array.from(document.querySelectorAll("#authors-list .item span")).map(span => span.textContent);
    const links    = Array.from(document.querySelectorAll("#links-list .item span a")).map(a => a.textContent);
    const email    = document.querySelector("input[type='email']").value;
    const institution = document.querySelector("input[placeholder='Учреждение']").value;
    const projectName = document.querySelector("input[placeholder='Название проекта']").value;
    const fileInput   = document.getElementById("file-upload");
    const projectDescription = document.getElementById("description").value;
    const consentFileInput   = document.getElementById("file-upload");
    if (!projectName || !projectDescription || !ageGroup || !email || !nomination || !institution || authors.length === 0) {
        alert("Заполните все обязательные поля!");
        console.log(projectName, projectDescription, email, ageGroup, nomination, institution, authors);
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
        const response = await fetch("/api/request", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Заявка успешно отправлена!");
        } else {
            alert("Ошибка при отправке заявки: " + response.error);
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке заявки.");
    }
}

async function loadOptions() {
    try {
        const age_response = await fetch("/api/age_groups");
        const age_data = await age_response.json();
        const ageGroupList = document.querySelector(".custom-select .options-list.age-group");
        age_data.forEach(group => {
            const li = document.createElement("li");
            li.textContent = group;
            ageGroupList.appendChild(li);
        });

        const nom_response = await fetch("/api/nominations");
        const nom_data = await nom_response.json();
        const nominationList = document.querySelector(".custom-select .options-list.nomination");
        nom_data.forEach(nomination => {
            const li = document.createElement("li");
            li.textContent = nomination;
            nominationList.appendChild(li);
        });
        
        selectorLogic();
    } catch (error) {
        console.error("Ошибка при загрузке опций:", error);
    }
}

function selectorLogic() {
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
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        const secretImage = document.createElement('img');
        secretImage.src = 'main/homeland.png';
        secretImage.style.position = 'fixed';
        secretImage.style.top = '0';
        secretImage.style.left = '0';
        secretImage.style.width = '100%';
        secretImage.style.height = '100%';
        secretImage.style.objectFit = 'cover';
        secretImage.style.zIndex = '9999';
        secretImage.style.cursor = 'pointer';
        secretImage.onclick = function() {
            secretImage.remove();
        };

        document.body.appendChild(secretImage);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadOptions();
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
    
    document.getElementById('file-upload').addEventListener('change', function(event) {
        const fileName = event.target.files[0] ? event.target.files[0].name : 'Прикрепите согласие';
        document.querySelector('.file-label').textContent = fileName;
    });      
});
