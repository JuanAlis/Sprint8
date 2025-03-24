const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alumnos_inscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  preguntas: [
    {
      alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      contenido: { type: String, required: true },
      respuesta_profesor: { type: String }
    }
  ],
  fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
