// validators/NewValidator.js
const { check, validationResult } = require('express-validator');
const { Category, User, State } = require('../config/db');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validatorNewCreate = [
    check('categoria_id').notEmpty().withMessage('El campo categoria_id es obligatorio').isInt().withMessage('El campo categoria_id debe ser un numero entero')
        .custom(async (value) => {
            const category = await Category.findOne({ where: { id: value, activo: true } });
            if (!category) {
                throw new Error('No existe una categoria activa con ese id');
            }
        }),

    check('estado_id').notEmpty().withMessage('El campo estado_id es obligatorio').isInt().withMessage('El campo estado_id debe ser un numero entero')
        .custom(async (value) => {
            const state = await State.findOne({ where: { id: value, activo: true } });
            if (!state) {
                throw new Error('No existe un estado activo con ese id');
            }
        }),

    check('titulo').notEmpty().withMessage('El campo titulo es obligatorio').isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),
    check('description').notEmpty().withMessage('El campo description es obligatorio').isLength({ min: 2 }).withMessage('El campo description debe tener al menos 2 caracteres'),
    check('imagen').optional().isURL().withMessage('El campo imagen debe ser una URL válida'), // Cambiado a isURL para mayor flexibilidad
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser un booleano'),
    
    handleValidationErrors
];

const validatorNewUpdate = [
    check('categoria_id').optional().isInt().withMessage('El campo categoria_id debe ser un numero entero')
        .custom(async (value) => {
            const category = await Category.findOne({ where: { id: value, activo: true } });
            if (!category) {
                throw new Error('No existe una categoria activa con ese id');
            }
        }),

    check('estado_id').optional().isInt().withMessage('El campo estado_id debe ser un numero entero')
        .custom(async (value) => {
            const state = await State.findOne({ where: { id: value, activo: true } });
            if (!state) {
                throw new Error('No existe un estado activo con ese id');
            }
        }),

    check('titulo').optional().isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),
    check('description').optional().isLength({ min: 2 }).withMessage('El campo description debe tener al menos 2 caracteres'),
    check('imagen').optional().isURL().withMessage('El campo imagen debe ser una URL válida'),
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser un booleano'),
    
    handleValidationErrors
];

module.exports = {
    validatorNewCreate,
    validatorNewUpdate
};