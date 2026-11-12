const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const router = express.Router();
const archivo = path.join(__dirname, 'data', 'tareas.json');

function leerTareas() {
    return JSON.parse(fs.readFileSync(archivo, 'utf8').replace(/^\uFEFF/, ''));
}

function guardarTareas(tareas) {
    fs.writeFileSync(archivo, JSON.stringify(tareas, null, 2));
}

// GET: consultar todas las tareas
router.get('/', (req, res) => {
    res.json(leerTareas());
});

// POST: crear una tarea
router.post('/', (req, res) => {
    const { titulo, descripcion = '', estado = 'pendiente' } = req.body;

    if (typeof titulo !== 'string' || !titulo.trim()) {
        return res.status(400).json({ error: 'El titulo es obligatorio' });
    }

    if (!['pendiente', 'en progreso', 'completada'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no valido' });
    }

    const tareas = leerTareas();

    const nuevaTarea = {
        id: randomUUID(),
        titulo: titulo.trim(),
        descripcion: String(descripcion).trim(),
        estado,
        fechaCreacion: new Date().toISOString()
    };

    tareas.push(nuevaTarea);
    guardarTareas(tareas);

    res.status(201).json(nuevaTarea);
});

// PUT: actualizar una tarea
router.put('/:id', (req, res) => {
    const tareas = leerTareas();
    const indice = tareas.findIndex(t => t.id === req.params.id);

    if (indice === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const { titulo, descripcion, estado } = req.body;

    if (titulo !== undefined &&
        (typeof titulo !== 'string' || !titulo.trim())) {
        return res.status(400).json({ error: 'Titulo no valido' });
    }

    if (estado !== undefined &&
        !['pendiente', 'en progreso', 'completada'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no valido' });
    }

    tareas[indice] = {
        ...tareas[indice],
        ...(titulo !== undefined && { titulo: titulo.trim() }),
        ...(descripcion !== undefined && { descripcion: String(descripcion).trim() }),
        ...(estado !== undefined && { estado })
    };

    guardarTareas(tareas);
    res.json(tareas[indice]);
});

// DELETE: eliminar una tarea
router.delete('/:id', (req, res) => {
    const tareas = leerTareas();
    const filtradas = tareas.filter(t => t.id !== req.params.id);

    if (filtradas.length === tareas.length) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    guardarTareas(filtradas);
    res.json({ mensaje: 'Tarea eliminada correctamente' });
});

module.exports = router;
