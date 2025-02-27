document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");

    if (!requestId) {
        document.body.innerHTML = "<div>Request not found</div>";
        return;
    }

    const archRequests = JSON.parse(localStorage.getItem("archRequests")) || [];
    const selectedRequest = archRequests.find(request => request.id === parseInt(requestId));

    if (!selectedRequest) {
        document.body.innerHTML = "<div>Request not found</div>";
        return;
    }

    document.getElementById("request-date").textContent = selectedRequest.date;
    document.getElementById("request-author").textContent = selectedRequest.author;
    document.getElementById("request-email").textContent = selectedRequest.email;
    document.getElementById("request-nomination").textContent = selectedRequest.nomination;
    document.getElementById("request-title").textContent = selectedRequest.title;
    document.getElementById("request-description").textContent = selectedRequest.description;
    
    document.getElementById("consent-link1").href = selectedRequest.consentLink1;
    document.getElementById("consent-link2").href = selectedRequest.consentLink2;

    const attachedLinksContainer = document.getElementById("attached-links");
    selectedRequest.attachedLinks.forEach(link => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${link}" target="_blank">${link}</a> 
                              <button class="button copy-button" onclick="copyToClipboard('${link}')"></button>`;
        attachedLinksContainer.appendChild(listItem);
    });
});

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text);
}

function handleDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");
    let archRequests = JSON.parse(localStorage.getItem("archRequests")) || [];
    archRequests = archRequests.filter(request => request.id !== parseInt(requestId));
    localStorage.setItem("archRequests", JSON.stringify(archRequests));
    window.location.href = "/admin-panel.html";
}

function toggleHover(state) {
    document.querySelector(".hovering-buttons1").style.transform = state ? "translateX(15%)" : "translateX(100%)";
}
