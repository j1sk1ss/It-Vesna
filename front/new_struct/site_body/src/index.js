document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");

    function render() {
        root.innerHTML = `
            <h1>Добро пожаловать в приложение</h1>
            <nav>
                <a href="/" data-route>Главная</a> |
                <a href="/about" data-route>О нас</a> |
                <a href="/contact" data-route>Контакты</a>
            </nav>
            <div id="content"></div>
        `;

        const content = document.getElementById("content");

        function navigate(event) {
            if (event.target.matches("[data-route]")) {
                event.preventDefault();
                const path = event.target.getAttribute("href");
                window.history.pushState({}, "", path);
                updateContent();
            }
        }

        function updateContent() {
            const path = window.location.pathname;
            if (path === "/about") {
                content.innerHTML = "<h2>О нас</h2><p>Информация о компании.</p>";
            } else if (path === "/contact") {
                content.innerHTML = "<h2>Контакты</h2><p>Свяжитесь с нами!</p>";
            } else {
                content.innerHTML = "<h2>Главная</h2><p>Добро пожаловать!</p>";
            }
        }

        window.addEventListener("popstate", updateContent);
        document.body.addEventListener("click", navigate);
        updateContent();
    }

    render();
});
