import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoute.js";
import db from "./config/DatabasePam.js";
import vehicleRoutes from "./routes/VehicleRoute.js";
import FavoriteRoute from "./routes/FavoriteRoute.js";


dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api', userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use(FavoriteRoute);
app.get("/", (req, res) => {
    res.json({
        message: "Backend Pameran Otomotif berjalan!"
    });
});

const PORT = process.env.PORT || 5000;



(async () => {
    try {
        await db.authenticate();
        console.log("Database connected...");

        await db.sync(); // Sinkron semua model sekaligus

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
})();
