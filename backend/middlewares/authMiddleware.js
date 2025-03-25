const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); 

        if (!req.user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido.' });
    }
};


exports.isAdmin = (req, res, next) => {
    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
    next();
};
