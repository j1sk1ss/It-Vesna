document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const requestBody = {
            mail: email,
            password: password
        };

        try {
            const response = await fetch('back/login-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const userData = await response.json();
                const userStatus = userData.status;
                const userRole = userData.role;

                console.log('Статус:', userStatus);
                console.log('Роль:', userRole);

                // Перенаправляем пользователя на главную страницу
                window.location.href = "main-user.html";
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
