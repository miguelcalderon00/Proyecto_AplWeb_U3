
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    listarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
} from '../services/tareasService'

const tareas = ref([])
const titulo = ref('')
const descripcion = ref('')
const estado = ref('pendiente')

const cargando = ref(false)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')
const tareaEditando = ref(null)

let controlador = null

async function cargarTareas() {
    controlador?.abort()
    controlador = new AbortController()

    const actual = controlador
    cargando.value = true
    error.value = ''

    try {
        tareas.value = await listarTareas(actual.signal)
    } catch (err) {
        if (err.name !== 'AbortError') {
            error.value = err.message || 'No se pudieron cargar las tareas'
        }
    } finally {
        if (controlador === actual) {
            cargando.value = false
        }
    }
}

function limpiarFormulario() {
    titulo.value = ''
    descripcion.value = ''
    estado.value = 'pendiente'
    tareaEditando.value = null
}

function editarTarea(tarea) {
    tareaEditando.value = tarea.id
    titulo.value = tarea.titulo
    descripcion.value = tarea.descripcion
    estado.value = tarea.estado
    mensaje.value = ''
    error.value = ''

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function guardarTarea() {
    if (!titulo.value.trim()) {
        error.value = 'El título es obligatorio'
        return
    }

    guardando.value = true
    error.value = ''
    mensaje.value = ''

    const datos = {
        titulo: titulo.value,
        descripcion: descripcion.value,
        estado: estado.value
    }

    try {
        if (tareaEditando.value) {
            await actualizarTarea(tareaEditando.value, datos)
            mensaje.value = 'Tarea actualizada correctamente'
        } else {
            await crearTarea(datos)
            mensaje.value = 'Tarea creada correctamente'
        }

        limpiarFormulario()
        await cargarTareas()
    } catch (err) {
        error.value = err.message || 'No se pudo guardar la tarea'
    } finally {
        guardando.value = false
    }
}

async function borrarTarea(id) {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta tarea?')

    if (!confirmar) return

    error.value = ''
    mensaje.value = ''

    try {
        await eliminarTarea(id)

        if (tareaEditando.value === id) {
            limpiarFormulario()
        }

        mensaje.value = 'Tarea eliminada correctamente'
        await cargarTareas()
    } catch (err) {
        error.value = err.message || 'No se pudo eliminar la tarea'
    }
}

onMounted(cargarTareas)

onUnmounted(() => {
    controlador?.abort()
})
</script>

<template>
    <main class="tasks-page">
        <section class="intro">
            <h2>Mis tareas</h2>
            <p>Organiza tus actividades y lleva el control de tu progreso.</p>
        </section>

        <section class="task-form">
            <h3>{{ tareaEditando ? 'Editar tarea' : 'Agregar nueva tarea' }}</h3>

            <form @submit.prevent="guardarTarea">
                <label for="titulo">Título</label>
                <input
                    id="titulo"
                    v-model="titulo"
                    type="text"
                    placeholder="Ej. Estudiar para el examen"
                    required
                >

                <label for="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    v-model="descripcion"
                    placeholder="Detalles de la tarea"
                    rows="3"
                ></textarea>

                <label for="estado">Estado</label>
                <select id="estado" v-model="estado">
                    <option value="pendiente">Pendiente</option>
                    <option value="en progreso">En progreso</option>
                    <option value="completada">Completada</option>
                </select>

                <div class="form-buttons">
                    <button type="submit" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : tareaEditando ? 'Guardar cambios' : 'Crear tarea' }}
                    </button>

                    <button
                        v-if="tareaEditando"
                        type="button"
                        class="cancel-button"
                        @click="limpiarFormulario"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </section>

        <p v-if="mensaje" class="success-message" role="status">
            {{ mensaje }}
        </p>

        <p v-if="error" class="error-message" role="alert">
            {{ error }}
        </p>

        <section class="task-list">
            <div class="list-heading">
                <h3>Lista de tareas</h3>
                <button type="button" @click="cargarTareas" :disabled="cargando">
                    {{ cargando ? 'Actualizando...' : 'Actualizar' }}
                </button>
            </div>

            <p v-if="cargando" role="status">Cargando tareas...</p>

            <p v-else-if="!error && tareas.length === 0">
                Todavía no tienes tareas registradas.
            </p>

            <article
                v-for="tarea in tareas"
                :key="tarea.id"
                class="task-card"
            >
                <div class="task-info">
                    <h4>{{ tarea.titulo }}</h4>
                    <p>{{ tarea.descripcion || 'Sin descripción' }}</p>
                    <span class="task-status">{{ tarea.estado }}</span>
                </div>

                <div class="task-actions">
                    <button
                        type="button"
                        class="edit-button"
                        @click="editarTarea(tarea)"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        @click="borrarTarea(tarea.id)"
                    >
                        Eliminar
                    </button>
                </div>
            </article>
        </section>
    </main>
</template>

<style scoped>
.tasks-page {
    display: grid;
    gap: 28px;
}

.intro h2 {
    margin-bottom: 8px;
    font-size: 2rem;
}

.intro p,
.task-card p {
    color: #64748b;
}

.task-form,
.task-list {
    background: white;
    padding: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.task-form form {
    display: grid;
    gap: 12px;
}

.task-form input,
.task-form textarea,
.task-form select {
    width: 100%;
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

button {
    cursor: pointer;
}

.form-buttons,
.task-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.task-form button,
.list-heading button,
.task-actions button {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
}

.task-form button,
.list-heading button,
.edit-button {
    background: #2563eb;
}

.cancel-button {
    background: #64748b;
}

.delete-button {
    background: #dc2626;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.list-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.task-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;
}

.task-card h4 {
    margin: 0 0 8px;
}

.task-status {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 0.85rem;
}

.success-message {
    color: #15803d;
}

.error-message {
    color: #b91c1c;
}

@media (max-width: 600px) {
    .task-form,
    .task-list {
        padding: 16px;
    }

    .list-heading,
    .task-card {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
