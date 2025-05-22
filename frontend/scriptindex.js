
    const apiBaseUrl = "http://localhost:5000/api";
const accessToken = localStorage.getItem("accessToken");
const messageEl = document.getElementById("message");
const vehiclesTableBody = document.querySelector("#vehiclesTable tbody");
const vehicleForm = document.getElementById("vehicleForm");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (!accessToken) {
    alert("Kamu belum login!");
    window.location.href = "login.html";
}

// Tampilkan pesan
function showMessage(msg, color = "red") {
    messageEl.style.color = color;
    messageEl.textContent = msg;
    setTimeout(() => {
        messageEl.textContent = "";
    }, 3000);
}

// Ambil dan tampilkan daftar kendaraan
async function fetchVehicles() {
    try {
        const res = await fetch(`${apiBaseUrl}/vehicles`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!res.ok) throw new Error("Gagal mengambil data kendaraan");
        const vehicles = await res.json();
        renderVehicles(vehicles);
    } catch (error) {
        showMessage(error.message);
    }
}

// Render tabel kendaraan
function renderVehicles(vehicles) {
    vehiclesTableBody.innerHTML = "";
    vehicles.forEach(v => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${v.name}</td>
          <td>${v.brand || ""}</td>
          <td>${v.year || ""}</td>
          <td>${v.category || ""}</td>
          <td>${v.description || ""}</td>
          <td>${v.image_url ? `<img src="${v.image_url}" alt="${v.name}" width="100">` : ""}</td>
          <td>
            <button onclick="editVehicle(${v.id})">Edit</button>
            <button onclick="deleteVehicle(${v.id})">Hapus</button>
          </td>
        `;
        vehiclesTableBody.appendChild(tr);
    });
}

// Submit form tambah/edit kendaraan
vehicleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("vehicleId").value;
    const name = document.getElementById("name").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const year = parseInt(document.getElementById("year").value) || null;
    const category = document.getElementById("category").value.trim();
    const description = document.getElementById("description").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    if (!name) {
        showMessage("Nama kendaraan wajib diisi");
        return;
    }

    const payload = {
        name,
        brand,
        year,
        category,
        description,
        image_url
    };

    try {
        let res;
        if (id) {
            // Update kendaraan
            res = await fetch(`${apiBaseUrl}/vehicles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
        } else {
            // Tambah kendaraan baru
            res = await fetch(`${apiBaseUrl}/vehicles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.msg || "Gagal menyimpan data kendaraan");
        }

        showMessage("Data kendaraan berhasil disimpan", "green");
        vehicleForm.reset();
        document.getElementById("vehicleId").value = "";
        cancelBtn.classList.add("hidden");
        saveBtn.textContent = "Simpan";
        fetchVehicles();

    } catch (error) {
        showMessage(error.message);
    }
});

// Isi form untuk edit kendaraan
window.editVehicle = async function (id) {
    try {
        const res = await fetch(`${apiBaseUrl}/vehicles/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!res.ok) throw new Error("Gagal mengambil data kendaraan");
        const vehicle = await res.json();

        document.getElementById("vehicleId").value = vehicle.id;
        document.getElementById("name").value = vehicle.name;
        document.getElementById("brand").value = vehicle.brand || "";
        document.getElementById("year").value = vehicle.year || "";
        document.getElementById("category").value = vehicle.category || "";
        document.getElementById("description").value = vehicle.description || "";
        document.getElementById("image_url").value = vehicle.image_url || "";

        saveBtn.textContent = "Update";
        cancelBtn.classList.remove("hidden");
    } catch (error) {
        showMessage(error.message);
    }
};

// Batalkan edit form
cancelBtn.addEventListener("click", () => {
    vehicleForm.reset();
    document.getElementById("vehicleId").value = "";
    cancelBtn.classList.add("hidden");
    saveBtn.textContent = "Simpan";
});

// Hapus kendaraan
window.deleteVehicle = async function (id) {
    if (!confirm("Yakin ingin menghapus kendaraan ini?")) return;

    try {
        const res = await fetch(`${apiBaseUrl}/vehicles/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.msg || "Gagal menghapus kendaraan");
        }

        showMessage("Kendaraan berhasil dihapus", "green");
        fetchVehicles();
    } catch (error) {
        showMessage(error.message);
    }
};

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        const res = await fetch(`${apiBaseUrl}/logout`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!res.ok) throw new Error("Logout gagal");
    } catch (error) {
        // tetap lanjut logout frontend
    }
    localStorage.removeItem("accessToken");
    window.location.href = "login.html";
});

// Load data kendaraan saat halaman dibuka
fetchVehicles();