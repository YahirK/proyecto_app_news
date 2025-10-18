// config/db.js
const { Sequelize } = require('sequelize');

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = require('../config.js');

// 1. Configuración de la conexión a MySQL usando variables de entorno
const sequelize = new Sequelize(
    DB_NAME,    // Nombre de la base de datos
    DB_USER,    // Usuario
    DB_PASSWORD,// Contraseña
    {
        host: DB_HOST, // Host,
        dialect: 'mysql'           // Le decimos a Sequelize que usamos MySQL
    }
);

// 2. Importar los modelos
const User = require('../models/UserModel')(sequelize, Sequelize);
const Category = require('../models/CategoryModel')(sequelize, Sequelize);
const State = require('../models/StateModel')(sequelize, Sequelize);
const News = require('../models/NewsModel')(sequelize, Sequelize);
const Profile = require('../models/ProfileModel')(sequelize, Sequelize);

// 3. Definir las asociaciones entre tablas
User.belongsTo(Profile, { foreignKey: 'perfil_id', onDelete: 'CASCADE' });
Profile.hasMany(User, { foreignKey: 'perfil_id', onDelete: 'CASCADE' });

News.belongsTo(User, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
User.hasMany(News, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });

News.belongsTo(Category, { foreignKey: 'categoria_id', onDelete: 'CASCADE' });
Category.hasMany(News, { foreignKey: 'categoria_id', onDelete: 'CASCADE' });

News.belongsTo(State, { foreignKey: 'estado_id', onDelete: 'CASCADE' });
State.hasMany(News, { foreignKey: 'estado_id', onDelete: 'CASCADE' });

// 4. Función para conectar y sincronizar la base de datos
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Conectado exitosamente.');

        // La sincronización automática de la base de datos (sequelize.sync) ha sido eliminada.
        // Esta es una práctica peligrosa en producción. La estructura de la base de datos
        // debe gestionarse a través de migraciones manuales o scripts de SQL.
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB, User, Category, State, News, Profile };