require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
console.log("🔍 Cargando URI de MongoDB:", process.env.MONGO_URI);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor con MongoDB funcionando todo bien todo correcto');
});

// Rutas de autenticación
app.use('/api/auth', require('./routes/authRoutes'));  

// 🔹 Rutas de actividades (añade esta línea aquí)
app.use('/api/activities', require('./routes/activityRoutes'));

app.use('/api/users', require('./routes/userRoutes')); // Rutas de gestión de usuarios (Solo admins)


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
