import express from "express";
import { addFavorite, getFavoritesByUser } from "../controller/FavoriteController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Rute hanya untuk user yang sudah login
router.post("/favorites", verifyToken, addFavorite);
router.get("/favorites/:userId", verifyToken, getFavoritesByUser);

export default router;
