import express from "express";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controller/VehicleController.js";

import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Semua route di bawah ini perlu token valid (bisa kamu ganti sesuai kebutuhan)
router.get("/", verifyToken, getVehicles);
router.get("/:id", verifyToken, getVehicleById);
router.post("/", verifyToken, createVehicle);
router.put("/:id", verifyToken, updateVehicle);
router.delete("/:id", verifyToken, deleteVehicle);

export default router;
