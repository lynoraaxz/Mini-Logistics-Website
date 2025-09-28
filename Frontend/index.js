const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  document.getElementById("welcome").textContent = `Welcome, ${user.Name}!`;
  loadProfile(user.Username); // panggil loadProfile dengan username dari localStorage
} else {
  window.location.href = "login.html";
}

async function loadProfile(username) {
  try {
    console.log("🔎 Username:", username);

    const res = await fetch(`http://localhost:3000/employees/profile?username=${username}`);
    const data = await res.json();
    console.log("📦 Data dari API:", data);

    // update semua elemen dengan class profileName
    document.querySelectorAll(".profileName").forEach(el => {
      el.textContent = data.Name || "N/A";
    });

    // update semua elemen dengan class profileUsername
    document.querySelectorAll(".profileUsername").forEach(el => {
      el.textContent = data.Username || "N/A";
    });

    // update semua elemen dengan class profilePosition
    document.querySelectorAll(".profilePosition").forEach(el => {
      el.textContent = data.Position || "N/A";
    });

  } catch (err) {
    console.error("❌ Failed to load profile:", err);
  }
}

async function loadShipments() {
  try {
    const res = await fetch("http://localhost:3000/shipments/movement"); 
    const data = await res.json();

    const tbody = document.getElementById("shipmentTable");
    tbody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.ShipmentID}</td>
        <td>${new Date(row.ShipmentDate).toLocaleDateString()}</td>
        <td>${row.ShipmentType}</td>
        <td>${row.PartnerName}</td>
        <td>${row.ItemName}</td>
        <td>${row.Quantity}</td>
        <td><span class="badge bg-${
          row.Status === "Pending" ? "warning" :
          row.Status === "In Transit" ? "info" :
          row.Status === "Delivered" ? "success" :
          row.Status === "Received" ? "secondary" : "dark"
        }">${row.Status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading shipments:", err);
  }
}

// Load shipments when panel is opened
document.getElementById("shipmentPanel").addEventListener("show.bs.offcanvas", loadShipments);

async function loadSuppliers() {
  try {
    const res = await fetch("http://localhost:3000/suppliers/list");
    const data = await res.json();

    const tbody = document.getElementById("supplierTable");
    tbody.innerHTML = "";

    data.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.SupplierID}</td>
        <td>${s.SupplierName}</td>
        <td>${s.ContactPerson || "-"}</td>
        <td>${s.Phone || "-"}</td>
        <td>${s.Email || "-"}</td>
        <td>${s.Address || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading suppliers:", err);
  }
}

document.getElementById("supplierPanel").addEventListener("show.bs.offcanvas", loadSuppliers);

async function loadCust() {
  try {
    const res = await fetch("http://localhost:3000/cust/list");
    const data = await res.json();

    const tbody = document.getElementById("custTable");
    tbody.innerHTML = "";

    data.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.CustID}</td>
        <td>${s.CustName}</td>
        <td>${s.ContactPerson || "-"}</td>
        <td>${s.Phone || "-"}</td>
        <td>${s.Email || "-"}</td>
        <td>${s.Address || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading suppliers:", err);
  }
}

document.getElementById("custPanel").addEventListener("show.bs.offcanvas", loadCust);
