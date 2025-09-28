document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    Name: document.getElementById("Name").value,
    Position: document.getElementById("Position").value,
    Username: document.getElementById("Username").value,
    Password: document.getElementById("Password").value,
  };
  
  try {
    const res = await fetch("http://localhost:3000/employees/regis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Account created successfully!");
      window.location.href = "index.html"; // redirect ke login page
    } else {
      alert(data.message || "Failed to register");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
