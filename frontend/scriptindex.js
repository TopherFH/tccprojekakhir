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
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(`${apiBaseUrl}/vehicles`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (handleAuthError(res)) return;
    const vehicles = await res.json();
    renderVehiclesTable(vehicles);
}

// Render tabel kendaraan
function renderVehiclesTable(vehicles) {
    const tbody = document.querySelector("#vehiclesTable tbody");
    tbody.innerHTML = "";

    if (!vehicles || vehicles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; color:#888;">Tidak ada data kendaraan</td>
            </tr>
        `;
        return;
    }

    vehicles.forEach(vehicle => {
        tbody.innerHTML += `
            <tr>
                <td>${vehicle.name}</td>
                <td>${vehicle.brand || '-'}</td>
                <td>${vehicle.year || '-'}</td>
                <td>${vehicle.category || '-'}</td>
                <td>${vehicle.description || '-'}</td>
                <td>
                    ${vehicle.image_url ? `<img src="${vehicle.image_url}" alt="gambar" width="80">` : '<span style="color:#888;">Tidak ada gambar</span>'}
                </td>
                <td>
                    <button onclick="editVehicle(${vehicle.id})" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteVehicle(${vehicle.id})" class="btn btn-danger btn-sm">Hapus</button>
                </td>
            </tr>
        `;
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

    const accessToken = localStorage.getItem("accessToken");
    let res;
    if (id) {
        res = await fetch(`${apiBaseUrl}/vehicles/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });
    } else {
        res = await fetch(`${apiBaseUrl}/vehicles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });
    }
    if (handleAuthError(res)) return;

    try {
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
        if (handleAuthError(res)) return; 
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
        if (handleAuthError(res)) return; 
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

function handleAuthError(response) {
    if (response.status === 401) {
        // Bisa juga cek pesan error spesifik jika backend mengirim pesan token expired
        localStorage.removeItem("accessToken");
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        window.location.href = "login.html";
        return true;
    }
    return false;
}