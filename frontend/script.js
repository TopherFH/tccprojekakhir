const apiBaseUrl = "http://localhost:5000/api";

function showMessage(msg, color = "red") {
    const message = document.getElementById("message");
    message.style.color = color;
    message.textContent = msg;
}

// Handler untuk register
function registerHandler() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch(`${apiBaseUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    username,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.msg || "Register gagal");
                return;
            }

            showMessage("Register berhasil! Silakan login.", "green");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } catch (error) {
            showMessage("Terjadi kesalahan jaringan.");
        }
    });
}

function loginHandler() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // supaya cookie refresh token diterima
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.msg || "Login gagal");
                return;
            }

            // Simpan token dan info user
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("role", data.role);       // Simpan role dari response
            localStorage.setItem("userId", data.userId);   // Simpan userId dari response

            showMessage("Login berhasil! Mengarahkan...", "green");

            setTimeout(() => {
                if (data.role === "admin") {
                    window.location.href = "indexadmin.html";
                } else {
                    window.location.href = "indexuser.html";
                }
            }, 1000);
        } catch (error) {
            showMessage("Terjadi kesalahan jaringan.");
        }
    });
}
