// controllers/ProfileController.js
const { Profile } = require('../config/db');
const { Op } = require('sequelize');

/**
 * @desc    Obtener todos los perfiles, con opción de filtrado
 * @route   GET /api/profiles
 */
const getAllProfiles = async (req, res) => {
    try {
        const { nombre } = req.query;
        const where = {};

        if (nombre) {
            where.nombre = { [Op.like]: `%${nombre}%` };
        }

        const profiles = await Profile.findAll({ where });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener perfiles', error: error.message });
    }
};

/**
 * @desc    Obtener un perfil por su ID
 * @route   GET /api/profiles/:id
 */
const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findByPk(req.params.id);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener el perfil', error: error.message });
    }
};

/**
 * @desc    Crear un nuevo perfil
 * @route   POST /api/profiles
 */
const createProfile = async (req, res) => {
    try {
        const newProfile = await Profile.create(req.body);
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el perfil', error: error.message });
    }
};

/**
 * @desc    Actualizar un perfil por su ID
 * @route   PUT /api/profiles/:id
 */
const updateProfile = async (req, res) => {
    try {
        const [updatedRows] = await Profile.update(req.body, { where: { id: req.params.id } });
        if (updatedRows > 0) {
            const updatedProfile = await Profile.findByPk(req.params.id);
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};

// Nota: La eliminación de perfiles puede ser peligrosa si hay usuarios asignados.
// Por ahora, se omite la función 'destroy' para evitar eliminaciones accidentales.

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile
};