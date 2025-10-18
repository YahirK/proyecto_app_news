require('dotenv').config();
// seed.js
const { sequelize, Profile, State, Category } = require('./config/db');
const { profiles, states, categories } = require('./data/mockData');

const seedDatabase = async () => {
    try {
        // Sincronizar la base de datos
        await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada.');

        // Insertar datos
        await Profile.bulkCreate(profiles);
        console.log('Perfiles insertados.');

        await State.bulkCreate(states);
        console.log('Estados insertados.');

        await Category.bulkCreate(categories);
        console.log('Categorías insertadas.');

        console.log('¡Base de datos inicializada con éxito!');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
