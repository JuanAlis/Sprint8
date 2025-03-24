const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos el modelo de usuario

// Middleware de autenticación (Verifica el token y obtiene el usuario)
exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Buscamos el usuario en la BD

        if (!req.user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido.' });
    }
};

// Middleware para verificar si el usuario es admin
exports.isAdmin = (req, res, next) => {
    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
    next();
};
