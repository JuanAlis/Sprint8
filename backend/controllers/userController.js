const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (Solo admin)
exports.getUsers = async (req, res) => {
    try {
        if (req.user.tipo !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado. Solo los administradores pueden ver la lista de usuarios." });
        }

        const users = await User.find().select('-password');
        console.log("📦 Usuarios desde la DB:", users); // ⬅️ Aquí añadimos el log
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};


// Crear un usuario (Solo admin)
exports.createUser = async (req, res) => {
    try {
        if (req.user.tipo !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado. Solo los administradores pueden crear usuarios." });
        }

        const { nombre, email, password, tipo } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

        // Verificar si el tipo de usuario es válido
        if (!["profesor", "alumno"].includes(tipo)) {
            return res.status(400).json({ msg: "Tipo de usuario inválido. Solo se permite 'profesor' o 'alumno'." });
        }

        // Crear y guardar usuario con contraseña encriptada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ nombre, email, password: hashedPassword, tipo });

        await user.save();
        res.status(201).json({ msg: "Usuario creado correctamente", user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Editar un usuario (Admin puede editar a cualquiera, usuario solo se edita a sí mismo)
exports.updateUser = async (req, res) => {
    try {
        const { nombre, email, password, tipo } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Si no es admin, solo puede editar su propio perfil
        if (req.user.tipo !== "admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'No tienes permisos para editar este usuario' });
        }

        // Si es admin, permitir cambiar el tipo de usuario
        if (tipo && req.user.tipo === "admin") {
            if (!["profesor", "alumno", "admin"].includes(tipo)) {
                return res.status(400).json({ msg: "Tipo de usuario inválido." });
            }
            user.tipo = tipo;
        } else if (tipo) {
            return res.status(403).json({ msg: "No puedes cambiar tu tipo de usuario." });
        }

        // Actualizar datos
        if (nombre) user.nombre = nombre;
        if (email) user.email = email;

        // Si se envía una nueva contraseña, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ msg: 'Usuario actualizado correctamente', user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Eliminar un usuario (Solo admin)
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.tipo !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado. Solo los administradores pueden eliminar usuarios." });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Evitar que un admin se elimine a sí mismo accidentalmente
        if (req.user.id === req.params.id) {
            return res.status(400).json({ msg: "No puedes eliminar tu propia cuenta." });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
