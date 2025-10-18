// validators/StateValidator.js
const { check, validationResult } = require('express-validator');
const { State } = require('../config/db');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validatorStateCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
        .custom(async (value) => {
            const state = await State.findOne({ where: { nombre: value } });
            if (state) {
                throw new Error('Ya existe un estado con el mismo nombre');
            }
        }),

    check('abreviacion').notEmpty().withMessage('El campo abreviacion es obligatorio')
        .isString().withMessage('El campo abreviacion debe ser texto')
        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres'),
    
    handleValidationErrors
];

const validatorStateUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres'),

    check('abreviacion').optional()
        .isString().withMessage('El campo abreviacion debe ser texto')
        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres'),
    
    handleValidationErrors
];

module.exports = {
    validatorStateCreate,
    validatorStateUpdate
};