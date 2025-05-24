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


export const createVehicle = async (req, res) => {
  const { name, brand, year, description, image_url, category } = req.body;
  try {
    const newVehicle = await Vehicle.create({
      name,
      brand,
      year,
      description,
      image_url,
      category,
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  const id = req.params.id;
  const { name, brand, year, description, image_url, category } = req.body;
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ msg: "Vehicle tidak ditemukan" });

    vehicle.name = name;
    vehicle.brand = brand;
    vehicle.year = year;
    vehicle.description = description;
    vehicle.image_url = image_url;
    vehicle.category = category;

    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ msg: error.message });
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
