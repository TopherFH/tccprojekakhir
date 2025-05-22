import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Access Token tidak ditemukan" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Jika error expired token
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: "Access Token expired" });
      }
      // Error lain
      return res.status(403).json({ msg: "Token tidak valid" });
    }
    req.user = decoded;
    next();
  });
};