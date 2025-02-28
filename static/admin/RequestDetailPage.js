document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = parseInt(urlParams.get("id"));
    const request = getRequests().find(req => req.id === requestId);

    if (!request) {
        document.getElementById("requestDetails").innerHTML = "<div>Заявка не найдена</div>";
        return;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    }

    document.getElementById("requestDetails").innerHTML = `
        <div class="basic-stroke"><div>ФИО</div><div>${request.date}</div></div>
        <div class="stroke">
            <div>${request.author}</div>
            <button class="button copy-button" onclick="copyToClipboard('${request.author}')"></button>
        </div>
        <div class="basic-stroke">Почта </div>
        <div class="stroke">${request.email} <button class="button copy-button" onclick="copyToClipboard('${request.email}')"></button></div>
        <div class="basic-stroke">Номинация </div>
        <div class="stroke-nonborder">${request.nomination}</div>
        <div class="basic-stroke">Название</div>
        <div class="stroke-nonborder">${request.title}</div>
        <div class="basic-stroke">Описание</div>
        <div class="stroke-description">${request.description}</div>
        <div class="att-ref">
            <div><a href="${request.consentLink1}" target="_blank">Soglasie 1</a></div>
            <div><a href="${request.consentLink2}" target="_blank">Soglasie 2</a></div>
        </div>
        <ul>
            ${request.attachedLinks.map(link => `<li><a href="${link}" target="_blank">${link}</a> <button class="button copy-button" onclick="copyToClipboard('${link}')"></button></li>`).join("")}
        </ul>
    `;

    document.getElementById("deleteBtn").addEventListener("click", function () {
        deleteRequest(request.id);
        window.location.href = "admin-panel.html";
    });

    document.getElementById("approveBtn").addEventListener("click", function () {
        approve(request.id);
        window.location.href = "admin-panel.html";
    });

    document.getElementById("archiveBtn").addEventListener("click", function () {
        archive(request.id);
        window.location.href = "admin-panel.html";
    });

    const hoverContainer = document.getElementById("hoverContainer");
    const hoverButtons = document.getElementById("hoverButtons");

    hoverContainer.addEventListener("mouseenter", function () {
        hoverButtons.style.transform = "translateX(15%)";
    });

    hoverContainer.addEventListener("mouseleave", function () {
        hoverButtons.style.transform = "translateX(80%)";
    });
});
