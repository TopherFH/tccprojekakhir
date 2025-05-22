import Vehicle from "../models/VehicleModel.js";

// Dapatkan semua kendaraan
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Dapatkan kendaraan berdasarkan ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id }
    });
    if (!vehicle) return res.status(404).json({ msg: "Vehicle tidak ditemukan" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Tambah kendaraan baru
export const createVehicle = async (req, res) => {
  const { name, description, image_url, category } = req.body;
  try {
    await Vehicle.create({ name, description, image_url, category });
    res.status(201).json({ msg: "Vehicle berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Update kendaraan berdasarkan ID
export const updateVehicle = async (req, res) => {
  const { name, description, image_url, category } = req.body;
  try {
    const vehicle = await Vehicle.findOne({ where: { id: req.params.id } });
    if (!vehicle) return res.status(404).json({ msg: "Vehicle tidak ditemukan" });

    await Vehicle.update(
      { name, description, image_url, category },
      { where: { id: req.params.id } }
    );

    res.json({ msg: "Vehicle berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Hapus kendaraan berdasarkan ID
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { id: req.params.id } });
    if (!vehicle) return res.status(404).json({ msg: "Vehicle tidak ditemukan" });

    await Vehicle.destroy({ where: { id: req.params.id } });
    res.json({ msg: "Vehicle berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
