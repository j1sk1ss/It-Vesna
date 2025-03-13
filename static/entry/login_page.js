document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem("name", userData.name);
                localStorage.setItem("status", userData.status);
                localStorage.setItem("role", userData.role);
                if (userData.role === "admin") {
                    localStorage.setItem("key", userData.key);
                    window.location.href = "/main/admin";
                }
                else {
                    window.location.href = "/main/admin";
                }
            } else {
                console.error('Ошибка:', response.statusText);
                alert("Ошибка входа. Проверьте логин и пароль.");
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при входе.");
        }
    });
});
