const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    console.log("TOKEN:", token); // ✅ ahora sí existe
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // ✅ se imprime correctamente

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // para ver qué hay en el token

    req.usuario = decoded;
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = { authMiddleware };
