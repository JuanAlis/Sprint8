require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
console.log("🔍 Cargando URI de MongoDB:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar:', err));

app.get('/', (req, res) => {
  res.send('Servidor con MongoDB funcionando todo bien todo correcto');
});

app.use('/api/auth', require('./routes/authRoutes'));  

app.use('/api/activities', require('./routes/activityRoutes'));

app.use('/api/users', require('./routes/userRoutes')); 


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
