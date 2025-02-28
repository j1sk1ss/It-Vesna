const routes = {
    "/main": "entry/login"
};


function loadPage(url) {
    const route = Object.keys(routes).find(r => {
        if (r.includes(":id")) {
            const baseRoute = r.split("/:id")[0];
            return url.startsWith(baseRoute);
        }
        return r === url;
    });

    if (route) {
        const finalRoute = url.replace(/\/\d+$/, "/:id");

        fetch(`/${routes[finalRoute]}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Страница не найдена");
                }
                return response.text();
            })
            .then(html => {
                document.getElementById("app").innerHTML = html;
            })
            .catch(() => {
                document.getElementById("app").innerHTML = "<h1>Ошибка: страница не найдена</h1>";
            });
    } else {
        document.getElementById("app").innerHTML = "<h1>Ошибка: страница не найдена</h1>";
    }
}

window.addEventListener("popstate", () => loadPage(window.location.pathname));

function navigateTo(url) {
    history.pushState(null, null, url);
    loadPage(url);
}

document.addEventListener("DOMContentLoaded", () => {
    loadPage(window.location.pathname);
});
