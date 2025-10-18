// validators/CategoryValidator.js
const { check, validationResult } = require('express-validator');
const { Category } = require('../config/db');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validatorCategoryCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 5, max: 50 }).withMessage('El campo debe tener entre 5 y 50 caracteres')
        .custom(async (value) => {
            const category = await Category.findOne({ where: { nombre: value } });
            if (category) {
                throw new Error('Ya existe una categoría con el mismo nombre');
            }
        }),

    check('descripcion').notEmpty().withMessage('El campo descripcion es obligatorio')
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo debe tener entre 5 y 255 caracteres'),

    check('activo').optional()
        .isBoolean().withMessage('El campo activo debe ser con valor booleano'),
    
    handleValidationErrors
];

const validatorCategoryUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 5, max: 50 }).withMessage('El campo debe tener entre 5 y 50 caracteres'),

    check('descripcion').optional()
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo debe tener entre 5 y 255 caracteres'),

    check('activo').optional()
        .isBoolean().withMessage('El campo activo debe ser con valor booleano'),
    
    handleValidationErrors
];

module.exports = {
    validatorCategoryCreate,
    validatorCategoryUpdate
};