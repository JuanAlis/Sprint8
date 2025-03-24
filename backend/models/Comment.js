const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  actividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenido: { type: String, required: true },
  respuesta_profesor: { type: String },
  fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
