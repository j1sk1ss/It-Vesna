document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const agreed   = document.getElementById("agreed").checked;
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!agreed) {
            alert("Вы должны согласиться с политикой конфиденциальности!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        const codeGroup = document.getElementById("codeGroup");
        const confirmationCodeInput = document.getElementById("confirmationCode");

        if (codeGroup && codeGroup.style.display === "none") {
            codeGroup.style.display = "block";

            // (опционально) отправка кода на почту
            // await fetch("/api/send-code", { ... });

            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    password: password
                })
            });            

            if (response.ok) {
                window.location.assign("/main/user");
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
