const express = require('express');
const router = express.Router();
const { 
    createActivity, 
    inscribirseActividad, 
    hacerPregunta, 
    responderPregunta, 
    eliminarActividad, 
    eliminarPregunta, 
    editarPregunta, 
    editarRespuesta 
} = require('../controllers/activityController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas para actividades
router.post('/', authMiddleware, createActivity); // Solo profesores pueden crear actividades
router.post('/:id/inscribirse', authMiddleware, inscribirseActividad); // Inscribirse en una actividad (Solo alumnos)
router.post('/:id/preguntar', authMiddleware, hacerPregunta); // Hacer pregunta en actividad (Solo alumnos inscritos)
router.post('/:activityId/pregunta/:preguntaId/responder', authMiddleware, responderPregunta); // Responder pregunta (Solo profesor)

// Nuevas rutas
router.delete('/:id', authMiddleware, eliminarActividad); // Eliminar actividad (Solo profesor creador)
router.delete('/:activityId/pregunta/:preguntaId', authMiddleware, eliminarPregunta); // Eliminar pregunta (Solo alumno que la hizo)
router.put('/:activityId/pregunta/:preguntaId', authMiddleware, editarPregunta); // Editar pregunta (Solo alumno antes de respuesta)
router.put('/:activityId/pregunta/:preguntaId/respuesta', authMiddleware, editarRespuesta); // Editar respuesta (Solo profesor creador)

module.exports = router;
