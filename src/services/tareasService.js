const API_URL = '/api/tareas';
// Procesar respuestas y controlar errores HTTP
async function procesarRespuesta(response) {
    const datos = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(datos?.error || `Error HTTP: ${response.status}`);
    }

    return datos;
}

// Consultar todas las tareas
export async function listarTareas(signal) {
    const response = await fetch(API_URL, { signal });
    return procesarRespuesta(response);
}

// Crear una tarea
export async function crearTarea(tarea) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea)
    });

    return procesarRespuesta(response);
}

// Actualizar una tarea
export async function actualizarTarea(id, tarea) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea)
    });

    return procesarRespuesta(response);
}

// Eliminar una tarea
export async function eliminarTarea(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    return procesarRespuesta(response);
}
