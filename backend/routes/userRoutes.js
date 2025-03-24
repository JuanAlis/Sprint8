const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// 📌 Registrar un nuevo usuario (Permitido solo para Profesores y Alumnos)
router.post('/', async (req, res, next) => {
    try {
        const { tipo } = req.body;
        
        // Bloqueamos la creación de admins desde esta ruta
        if (tipo === "admin") {
            return res.status(403).json({ msg: "No puedes registrarte como admin" });
        }

        next(); // Pasa al controlador de creación de usuario
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor", error });
    }
}, createUser);

// 📌 Obtener todos los usuarios (Solo admin)
router.get('/', authMiddleware, isAdmin, getUsers);

// 📌 Editar usuario (Solo admin)
router.put('/:id', authMiddleware, isAdmin, updateUser);

// 📌 Eliminar usuario (Solo admin)
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;
