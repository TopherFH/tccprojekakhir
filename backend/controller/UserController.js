import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Ambil semua user (tanpa password)
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

// Register user/admin baru
export const Register = async (req, res) => {
    const {
        username,
        email,
        password,
        role
    } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashPassword,
            role: role || 'user' // gunakan role dari request, default ke 'user'
        });
        res.status(201).json({
            msg: "Register berhasil"
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
};

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return res.status(404).json({
            msg: "User tidak ditemukan"
        });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({
            msg: "Password salah"
        });

        const userId = user.id;
        const username = user.username;
        const role = user.role;

        const accessToken = jwt.sign({
                userId,
                username,
                role
            },
            process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            }
        );

        const refreshToken = jwt.sign({
                userId,
                username,
                role
            },
            process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            }
        );

        // Simpan refresh token di DB
        await User.update({
            refresh_token: refreshToken
        }, {
            where: {
                id: userId
            }
        });

        // Simpan refresh token di cookie httpOnly
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 hari
            secure: false, // true kalau pakai https
            sameSite: "strict"
        });

        // Kirim accessToken, role, dan userId ke frontend
        res.json({
            accessToken,
            role,
            userId
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

// Logout: hapus refresh token di DB dan cookie
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No Content

    // Cari user yang pakai refresh token ini
    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) {
        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    }

    // Hapus refresh token di DB
    await User.update({
        refresh_token: null
    }, {
        where: {
            id: user.id
        }
    });

    res.clearCookie('refreshToken');
    return res.json({
        msg: "Logout berhasil"
    });
};