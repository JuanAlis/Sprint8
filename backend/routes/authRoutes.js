const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Ruta protegida: Obtener perfil del usuario autenticado
router.get('/perfil', authMiddleware, getProfile);

module.exports = router;
