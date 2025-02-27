document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const agreed = document.getElementById("agreed").checked;

        if (!agreed) {
            alert("Вы должны согласиться с политикой конфиденциальности!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        const requestBody = {
            fullName,
            email,
            password
        };

        try {
            const response = await fetch("back/register_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                alert("Регистрация успешна!");
                window.location.href = "index.html";
            } else {
                alert("Ошибка регистрации. Попробуйте снова.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при регистрации.");
        }
    });
});

function openPrivacyPolicy() {
    alert("Политика конфиденциальности");
}
