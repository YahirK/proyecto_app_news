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
    // Aceptar 'description' o 'descripcion' (compatibilidad con front en español)
    check('description').custom((value, { req }) => {
        const desc = (req.body.description || req.body.descripcion || '').toString();
        if (!desc || desc.trim().length < 2) {
            throw new Error('El campo description o descripcion es obligatorio y debe tener al menos 2 caracteres');
        }
        return true;
    }),
    // Aceptar imagen como URL válida o como data URI (base64). Si no viene, es opcional.
    check('imagen').optional().custom((value, { req }) => {
        const img = value || req.body.image;
        if (!img) return true; // no hay imagen, pasar
        const s = img.toString();
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) {
            return true;
        }
        throw new Error('El campo imagen debe ser una URL válida o un data URI (base64)');
    }), // mayor flexibilidad
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
    // Para updates, aceptar 'description' o 'descripcion'
    check('description').optional().custom((value, { req }) => {
        const desc = (req.body.description || req.body.descripcion || '').toString();
        if (desc && desc.trim().length < 2) {
            throw new Error('El campo description o descripcion debe tener al menos 2 caracteres');
        }
        return true;
    }),
    check('imagen').optional().custom((value, { req }) => {
        const img = value || req.body.image;
        if (!img) return true;
        const s = img.toString();
        if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return true;
        throw new Error('El campo imagen debe ser una URL válida o un data URI (base64)');
    }),
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser un booleano'),
    
    handleValidationErrors
];

module.exports = {
    validatorNewCreate,
    validatorNewUpdate
};