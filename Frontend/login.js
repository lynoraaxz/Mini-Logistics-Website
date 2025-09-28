    const API_URL = "http://localhost:3000/employees/login";

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const Username = document.getElementById("username").value;
      const Password = document.getElementById("password").value;

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Username, Password })
        });

        const data = await res.json();
        const msg = document.getElementById("message");

        if (res.ok && data.success) {
          setTimeout(() => {
          window.location.href = "dashboard.html";
          }, 800);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "dashboard.html";

        } else {
          msg.textContent = "❌ " + (data.message || "Something went wrong");
          msg.style.color = "red";
        }
      } catch (error) {
        document.getElementById("message").textContent = "⚠️ Server not reachable!";
      }
    });
