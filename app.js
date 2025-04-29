require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { postgresConnection } = require('./config/database');
const defineCancionModel = require('./models/models');
const createCancionController = require('./controllers/controller');
const { configurarRutas } = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const CancionPostgres = defineCancionModel(postgresConnection);

const postgresController = createCancionController(CancionPostgres);

const postgresRouter = express.Router();

configurarRutas(postgresRouter, postgresController, 'postgres');


app.use('/api/postgres/canciones', postgresRouter);

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor' });
});


app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;