const routes = {
    "/": "pages/login.html",
    "/forgot-password": "pages/forgot-password.html",
    "/register": "pages/register.html",
    "/admin-panel": "pages/admin-panel.html",
    "/main-admin-page": "pages/main-admin.html",
    "/main-user-page": "pages/main-user.html",
    "/request-page": "pages/request.html",
    "/request/:id": "pages/request-detail.html",
    "/archive-request/:id": "pages/archive-request.html",
    "/approve-request/:id": "pages/approve-request.html",
};

// Функция загрузки страницы
function loadPage(url) {
    const route = Object.keys(routes).find(r => {
        if (r.includes(":id")) {
            const baseRoute = r.split("/:id")[0];
            return url.startsWith(baseRoute);
        }
        return r === url;
    });

    if (route) {
        fetch(routes[route])
            .then(response => response.text())
            .then(html => {
                document.getElementById("app").innerHTML = html;
            });
    } else {
        document.getElementById("app").innerHTML = "<h1>Страница не найдена</h1>";
    }
}

// Обработчик событий для смены URL
window.addEventListener("popstate", () => loadPage(window.location.pathname));

// Перенаправление на новую страницу
function navigateTo(url) {
    history.pushState(null, null, url);
    loadPage(url);
}

// Загрузка страниц при загрузке
document.addEventListener("DOMContentLoaded", () => {
    loadPage(window.location.pathname);
});
