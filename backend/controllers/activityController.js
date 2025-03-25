const Activity = require('../models/Activity');

exports.createActivity = async (req, res) => {
    try {
        if (req.user.tipo !== 'profesor') {
            return res.status(403).json({ msg: 'Solo los profesores pueden crear actividades' });
        }

        const { titulo, descripcion, fecha_inicio } = req.body;

        const activity = new Activity({
            titulo,
            descripcion,
            fecha_inicio,
            profesor: req.user.id 
        });

        await activity.save();

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.inscribirseActividad = async (req, res) => {
    try {
        const activityId = req.params.id;
        const alumnoId = req.user.id;

        if (req.user.tipo !== 'alumno') {
            return res.status(403).json({ msg: 'Solo los alumnos pueden inscribirse en actividades' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        if (activity.alumnos_inscritos.includes(alumnoId)) {
            return res.status(400).json({ msg: 'Ya estás inscrito en esta actividad' });
        }

        activity.alumnos_inscritos.push(alumnoId);
        await activity.save();

        res.status(200).json({ msg: 'Te has inscrito en la actividad', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.hacerPregunta = async (req, res) => {
    try {
        const activityId = req.params.id;
        const alumnoId = req.user.id;
        const { contenido } = req.body;

        if (req.user.tipo !== 'alumno') {
            return res.status(403).json({ msg: 'Solo los alumnos pueden hacer preguntas' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        if (!activity.alumnos_inscritos.includes(alumnoId)) {
            return res.status(403).json({ msg: 'Debes estar inscrito en la actividad para hacer preguntas' });
        }

        activity.preguntas.push({ alumno: alumnoId, contenido });
        await activity.save();

        res.status(201).json({ msg: 'Pregunta enviada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.responderPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const profesorId = req.user.id;
        const { respuesta } = req.body;

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'Solo el profesor creador puede responder preguntas' });
        }

        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        pregunta.respuesta_profesor = respuesta;
        await activity.save();

        res.status(200).json({ msg: 'Respuesta agregada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.eliminarActividad = async (req, res) => {
    try {
        const activityId = req.params.id;
        const profesorId = req.user.id;

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta actividad' });
        }

        await Activity.findByIdAndDelete(activityId);

        res.status(200).json({ msg: 'Actividad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.eliminarPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const alumnoId = req.user.id;

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        const preguntaIndex = activity.preguntas.findIndex(p => p._id.toString() === preguntaId);
        if (preguntaIndex === -1) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        if (activity.preguntas[preguntaIndex].alumno.toString() !== alumnoId) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar esta pregunta' });
        }

        activity.preguntas.splice(preguntaIndex, 1);
        await activity.save();

        res.status(200).json({ msg: 'Pregunta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.editarPregunta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const alumnoId = req.user.id;
        const { contenido } = req.body;

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        if (pregunta.alumno.toString() !== alumnoId) {
            return res.status(403).json({ msg: 'No tienes permisos para editar esta pregunta' });
        }

        if (pregunta.respuesta_profesor) {
            return res.status(400).json({ msg: 'No puedes editar una pregunta después de que el profesor ha respondido' });
        }

        pregunta.contenido = contenido;
        await activity.save();

        res.status(200).json({ msg: 'Pregunta editada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

exports.editarRespuesta = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const preguntaId = req.params.preguntaId;
        const profesorId = req.user.id;
        const { respuesta } = req.body;

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ msg: 'Actividad no encontrada' });

        if (activity.profesor.toString() !== profesorId) {
            return res.status(403).json({ msg: 'Solo el profesor creador puede editar respuestas' });
        }

        const pregunta = activity.preguntas.id(preguntaId);
        if (!pregunta) return res.status(404).json({ msg: 'Pregunta no encontrada' });

        pregunta.respuesta_profesor = respuesta;
        await activity.save();

        res.status(200).json({ msg: 'Respuesta editada correctamente', activity });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
