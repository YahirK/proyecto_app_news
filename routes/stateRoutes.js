// routes/stateRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState
} = require('../controllers/stateController');
const { authenticateAdmin } = require('../middleware/jwt');
const { validatorStateCreate, validatorStateUpdate } = require('../controllers/StateValidator');

// Rutas públicas (solo lectura)
router.get('/', getAllStates);
router.get('/:id', getStateById);

// Rutas protegidas (solo para administradores)
router.post('/', authenticateAdmin, validatorStateCreate, createState);
router.put('/:id', authenticateAdmin, validatorStateUpdate, updateState);
router.delete('/:id', authenticateAdmin, deleteState);

module.exports = router;