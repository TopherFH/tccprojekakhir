import Favorite from "../models/FavoriteModel.js";
import Vehicle from "../models/VehicleModel.js";

// Tambah kendaraan ke favorit
export const addFavorite = async (req, res) => {
    const {
        userId,
        vehicleId
    } = req.body;
    try {
        // Cek apakah sudah difavoritkan sebelumnya
        const existing = await Favorite.findOne({
            where: {
                userId,
                vehicleId
            }
        });
        if (existing) {
            return res.status(400).json({
                message: "Sudah ada di favorit."
            });
        }

        const favorite = await Favorite.create({
            userId,
            vehicleId
        });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({
            message: "Gagal menambahkan ke favorit",
            error
        });
    }
};

// Ambil semua kendaraan favorit milik user
export const getFavoritesByUser = async (req, res) => {
    const {
        userId
    } = req.params;
    try {
        const favorites = await Favorite.findAll({
            where: {
                userId
            },
            include: [{
                model: Vehicle
            }]
        });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data favorit",
            error
        });
    }
};