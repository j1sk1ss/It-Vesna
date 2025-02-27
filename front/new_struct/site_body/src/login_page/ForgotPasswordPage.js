document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const sendCodeBtn = document.getElementById("send-code-btn");
    const codeSection = document.getElementById("code-section");
    const confirmCodeBtn = document.getElementById("confirm-code-btn");
    const codeInput = document.getElementById("code");

    sendCodeBtn.addEventListener("click", async function () {
        const email = emailInput.value.trim();
        if (!email) {
            alert("Введите email");
            return;
        }

        try {
            const response = await fetch("send_code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert("Код отправлен на вашу почту.");
                codeSection.classList.remove("hidden");
                sendCodeBtn.style.display = "none";
            } else {
                alert("Ошибка отправки кода. Попробуйте снова.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при отправке кода.");
        }
    });

    confirmCodeBtn.addEventListener("click", async function () {
        const code = codeInput.value.trim();
        if (!code) {
            alert("Введите код");
            return;
        }

        try {
            const response = await fetch("back/confirm_code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            if (response.ok) {
                alert("Код подтвержден. Теперь вы можете изменить пароль.");
                window.location.href = "reset-password.html";
            } else {
                alert("Неверный код. Попробуйте снова.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при подтверждении кода.");
        }
    });
});
