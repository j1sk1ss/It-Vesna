// Инициализация данных в localStorage, если их там нет
if (!localStorage.getItem("requests")) {
    const initialRequests = [
        { 
            id: 1, 
            title: "Заявка 1", 
            author: "Егор", 
            date: "01.04.2024", 
            email: "egor@example.com", 
            nomination: "Номинация 1", 
            description: "Описание 2", 
            consentLink1: "http://example1.com", 
            consentLink2: "http://example2.com", 
            attachedLinks: ["http://attachedlink1.com", "http://attachedlink2.com"] 
        },
        { 
            id: 2, 
            title: "Заявка 2", 
            author: "Паша", 
            date: "02.04.2024", 
            email: "pasha@example.com", 
            nomination: "Номинация 2", 
            description: "Описание 1", 
            consentLink1: "http://example3.com", 
            consentLink2: "http://example4.com", 
            attachedLinks: ["http://attachedlink3.com", "http://attachedlink4.com"] 
        }
    ];
    localStorage.setItem("requests", JSON.stringify(initialRequests));
}

if (!localStorage.getItem("archRequests")) {
    localStorage.setItem("archRequests", JSON.stringify([]));
}

if (!localStorage.getItem("approveRequests")) {
    localStorage.setItem("approveRequests", JSON.stringify([]));
}

// Функции для управления заявками

function getRequests() {
    return JSON.parse(localStorage.getItem("requests")) || [];
}

function setRequests(requests) {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function getArchRequests() {
    return JSON.parse(localStorage.getItem("archRequests")) || [];
}

function setArchRequests(requests) {
    localStorage.setItem("archRequests", JSON.stringify(requests));
}

function getApproveRequests() {
    return JSON.parse(localStorage.getItem("approveRequests")) || [];
}

function setApproveRequests(requests) {
    localStorage.setItem("approveRequests", JSON.stringify(requests));
}

// Удаление заявки
function deleteRequest(id) {
    const requests = getRequests().filter(request => request.id !== id);
    setRequests(requests);
}

// Перенос заявки в архив и одобрение
function archive(id) {
    const requests = getRequests();
    const selectedRequest = requests.find(request => request.id === id);
    if (!selectedRequest) return;

    const archRequests = getArchRequests();
    const approveRequests = getApproveRequests();

    archRequests.push(selectedRequest);
    approveRequests.push(selectedRequest);

    setArchRequests(archRequests);
    setApproveRequests(approveRequests);
    setRequests(requests.filter(request => request.id !== id));
}

// Перенос в архив без одобрения
function archiveNoApprove(id) {
    const archRequests = getArchRequests();
    const selectedRequest = archRequests.find(request => request.id === id);
    if (!selectedRequest) return;

    setArchRequests([...archRequests, selectedRequest]);
}

// Удаление из архива
function deleteArchRequest(id) {
    setArchRequests(getArchRequests().filter(request => request.id !== id));
}

// Удаление из списка одобренных
function deleteApproveRequest(id) {
    setApproveRequests(getApproveRequests().filter(request => request.id !== id));
}

// Одобрение заявки
function approve(id) {
    const requests = getRequests();
    const selectedRequest = requests.find(request => request.id === id);
    if (!selectedRequest) return;

    const approveRequests = getApproveRequests();
    approveRequests.push(selectedRequest);

    setApproveRequests(approveRequests);
    setRequests(requests.filter(request => request.id !== id));
}
