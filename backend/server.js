const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const tareasRoutes = require('./routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gestion de Tareas funcionando correctamente',
        estado: 'OK'
    });
});

app.use('/api/tareas', tareasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
