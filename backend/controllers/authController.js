const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario (Profesor o Alumno)
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, tipo } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

        // Crear el nuevo usuario
        user = new User({ nombre, email, password, tipo });

        // Guardar en la base de datos
        await user.save();

        // Crear token
        const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Mail incorrecto' });

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrectas' });

        // Crear token
        const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Ruta protegida: Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // No enviamos la contraseña
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
