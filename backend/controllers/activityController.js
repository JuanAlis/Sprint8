const Activity = require('../models/Activity');

// Crear una nueva actividad (Solo para profesores)
exports.createActivity = async (req, res) => {
    try {
        // Verificar si el usuario es un profesor
        if (req.user.tipo !== 'profesor') {
            return res.status(403).json({ msg: 'Solo los profesores pueden crear actividades' });
        }

        const { titulo, descripcion, fecha_inicio } = req.body;

        // Crear la actividad
        const activity = new Activity({
            titulo,
            descripcion,
            fecha_inicio,
            profesor: req.user.id // El profesor autenticado crea la actividad
        });

        await activity.save();

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Inscribir un alumno en una actividad
exports.inscribirseActividad = async (req, res) => {
    try {
        const activityId = req.params.id;
        const alumnoId = req.user.id;

        // Verificar si el usuario es un alumno
        if (req.user.tipo !== 'alumno') {
            return res.status(403).json({ msg: 'Solo los alumnos pueden inscribirse en actividades' });
        }

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Verificar si el alumno ya está inscrito
        if (activity.alumnos_inscritos.includes(alumnoId)) {
            return res.status(400).json({ msg: 'Ya estás inscrito en esta actividad' });
        }

        // Inscribir al alumno
        activity.alumnos_inscritos.push(alumnoId);
        await activity.save();

        res.status(200).json({ msg: 'Te has inscrito en la actividad', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Agregar una pregunta a una actividad (Solo alumnos inscritos)
exports.hacerPregunta = async (req, res) => {
    try {
        const activityId = req.params.id;
        const alumnoId = req.user.id;
        const { contenido } = req.body;

        // Verificar si el usuario es un alumno
        if (req.user.tipo !== 'alumno') {
            return res.status(403).json({ msg: 'Solo los alumnos pueden hacer preguntas' });
        }

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Verificar si el alumno está inscrito en la actividad
        if (!activity.alumnos_inscritos.includes(alumnoId)) {
            return res.status(403).json({ msg: 'Debes estar inscrito en la actividad para hacer preguntas' });
        }

        // Agregar la pregunta
        activity.preguntas.push({ alumno: alumnoId, contenido });
        await activity.save();

        res.status(201).json({ msg: 'Pregunta enviada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Responder una pregunta en una actividad (Solo el profesor creador de la actividad)
exports.responderPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const profesorId = req.user.id;
        const { respuesta } = req.body;

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Verificar si el usuario es el profesor que creó la actividad
        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'Solo el profesor creador puede responder preguntas' });
        }

        // Buscar la pregunta dentro de la actividad
        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        // Agregar la respuesta
        pregunta.respuesta_profesor = respuesta;
        await activity.save();

        res.status(200).json({ msg: 'Respuesta agregada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Eliminar una actividad (Solo el profesor creador)
exports.eliminarActividad = async (req, res) => {
    try {
        const activityId = req.params.id;
        const profesorId = req.user.id;

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Verificar si el usuario es el profesor que la creó
        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta actividad' });
        }

        // Eliminar la actividad
        await Activity.findByIdAndDelete(activityId);

        res.status(200).json({ msg: 'Actividad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Eliminar una pregunta (Solo el alumno que la hizo)
exports.eliminarPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const alumnoId = req.user.id;

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Buscar la pregunta dentro de la actividad
        const preguntaIndex = activity.preguntas.findIndex(p => p._id.toString() === preguntaId);
        if (preguntaIndex === -1) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        // Verificar si el alumno es quien hizo la pregunta
        if (activity.preguntas[preguntaIndex].alumno.toString() !== alumnoId) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta pregunta' });
        }

        // Eliminar la pregunta
        activity.preguntas.splice(preguntaIndex, 1);
        await activity.save();

        res.status(200).json({ msg: 'Pregunta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Editar una pregunta (Solo el alumno antes de que el profesor responda)
exports.editarPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const alumnoId = req.user.id;
        const { contenido } = req.body;

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Buscar la pregunta dentro de la actividad
        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        // Verificar si el alumno es quien hizo la pregunta
        if (pregunta.alumno.toString() !== alumnoId) {
            return res.status(403).json({ msg: 'No tienes permisos para editar esta pregunta' });
        }

        // Verificar si la pregunta ya tiene una respuesta del profesor
        if (pregunta.respuesta_profesor) {
            return res.status(400).json({ msg: 'No puedes editar una pregunta después de que el profesor ha respondido' });
        }

        // Editar el contenido de la pregunta
        pregunta.contenido = contenido;
        await activity.save();

        res.status(200).json({ msg: 'Pregunta editada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Editar una respuesta (Solo el profesor creador de la actividad)
exports.editarRespuesta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const profesorId = req.user.id;
        const { respuesta } = req.body;

        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        // Verificar si el usuario es el profesor que creó la actividad
        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'Solo el profesor creador puede editar respuestas' });
        }

        // Buscar la pregunta dentro de la actividad
        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        // Editar la respuesta del profesor
        pregunta.respuesta_profesor = respuesta;
        await activity.save();

        res.status(200).json({ msg: 'Respuesta editada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
