// app.js
const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const cors = require('cors');
const { connectDB } = require('./config/db'); // <-- 1. IMPORTAR LA CONEXIÓN (AQUÍ ARRIBA)


// Conectar a la base de datos
connectDB(); // <-- 2. LLAMAR A LA FUNCIÓN PARA CONECTAR (JUSTO AQUÍ)

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- Importar rutas de usuario
const profileRoutes = require('./routes/ProfileRoute'); // <-- Importar rutas de perfil

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'], // Agrega aquí los orígenes permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({limit: '50mb'})); // <-- express.json() reemplaza a bodyParser.json()
app.use(express.urlencoded({ extended: false })); // <-- express.urlencoded() reemplaza a bodyParser.urlencoded()

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes); // <-- Usar rutas de usuario
app.use('/api/profiles', profileRoutes); // <-- Usar rutas de perfil

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('API de Noticias de México funcionando!');
});

const { PORT } = require("./config");

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});