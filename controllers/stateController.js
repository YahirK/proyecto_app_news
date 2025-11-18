// controllers/stateController.js
const { State } = require('../config/db'); // Importar el modelo de Sequelize
const { Op } = require('sequelize');

// @desc    Obtener todos los estados
// @route   GET /api/states
const getAllStates = async (req, res) => {
    try {
        const { nombre, abreviacion } = req.query;
        const where = { activo: true };

        if (nombre) {
            where.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (abreviacion) {
            where.abreviacion = { [Op.like]: `%${abreviacion}%` };
        }
        const states = await State.findAll({ where });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener los estados' });
    }
};

// @desc    Obtener un estado por ID
// @route   GET /api/states/:id
const getStateById = async (req, res) => {
    try {
        const state = await State.findByPk(req.params.id);
        if (state) {
            res.json(state);
        } else {
            res.status(404).json({ message: 'Estado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Crear un nuevo estado
// @route   POST /api/states
const createState = async (req, res) => {
    const { nombre, abreviacion } = req.body;
    try { // La validación ya se hizo en el middleware
        const payload = {
            nombre,
            abreviacion,
            activo: req.body.activo !== undefined ? req.body.activo : true,
            UserAlta: req.body.UserAlta || req.body.nick || 'system',
            FechaAlta: req.body.FechaAlta || new Date(),
            UserMod: req.body.UserMod || req.body.nick || 'system',
            FechaMod: req.body.FechaMod || new Date(),
            UserBaja: req.body.UserBaja || req.body.nick || 'system',
            FechaBaja: req.body.FechaBaja || new Date()
        };

        const newState = await State.create(payload);
        res.status(201).json(newState);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el estado', error: error.message });
    }
};

// @desc    Actualizar un estado
// @route   PUT /api/states/:id
const updateState = async (req, res) => {
    try {
        await State.update(req.body, {
            where: { id: req.params.id }
        });
        const updatedState = await State.findByPk(req.params.id);

        if (!updatedState) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }
        res.json(updatedState);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el estado', error: error.message });
    }
};

// @desc    Eliminar un estado (baja lógica)
// @route   DELETE /api/states/:id
const deleteState = async (req, res) => {
    try {
        const [updated] = await State.update({ activo: false }, {
            where: { id: req.params.id }
        });
        const state = updated > 0;
        if (!state) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }
        res.json({ message: 'Estado desactivado' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al desactivar el estado' });
    }
};

module.exports = {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState
};