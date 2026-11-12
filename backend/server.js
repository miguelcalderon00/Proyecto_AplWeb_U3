const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const tareasRoutes = require('./routes');

app.use(cors());
app.use(express.json());

// Ruta principal de la API
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'API de Gestion de Tareas funcionando correctamente',
        estado: 'OK'
    });
});

// Rutas CRUD de tareas
app.use('/api/tareas', tareasRoutes);

// Servir archivos de Vue compilados
const carpetaFrontend = path.join(__dirname, '..', 'dist');

app.use(express.static(carpetaFrontend));

// Permitir la navegación de Vue Router
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        return next();
    }

    res.sendFile(path.join(carpetaFrontend, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});