import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({
        msg: "Refresh Token tidak ditemukan"
    });

    try {
        // Cari user yang punya refresh token ini di DB
        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user) return res.status(403).json({
            msg: "Refresh Token tidak valid"
        });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const {
            userId,
            username,
            role
        } = decoded;

        const accessToken = jwt.sign({
                userId,
                username,
                role
            },
            process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            }
        );

        res.json({
            accessToken
        });
    } catch (error) {
        return res.status(403).json({
            msg: "Refresh Token tidak valid"
        });
    }
};