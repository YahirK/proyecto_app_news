// validators/UserValidator.js
const { check, validationResult } = require('express-validator');
const { User, Profile } = require('../config/db');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validatorUserCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').notEmpty().withMessage('El campo apellidos es obligatorio')
        .isString().withMessage('El campo apellidos debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').notEmpty().withMessage('El campo nick es obligatorio')
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('correo').notEmpty().withMessage('El campo correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo valido')
        .custom(async (value) => {
            const user = await User.findOne({ where: { correo: value } });
            if (user) {
                throw new Error('Ya existe un usuario con el mismo correo');
            }
        }),

    check('contraseña').notEmpty().withMessage('El campo contraseña es obligatorio')
        .isString().withMessage('El campo contraseña debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),

    check('profile_id').notEmpty().withMessage('El campo profile_id es obligatorio')
        .isInt().withMessage('El campo profile_id debe ser numero')
        .custom(async (value) => {
            const profile = await Profile.findByPk(value);
            if (!profile) {
                throw new Error('No existe un perfil con ese id');
            }
        }),
    
    handleValidationErrors
];

const validatorUserUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').optional()
        .isString().withMessage('El campo apellidos debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').optional()
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('contraseña').optional()
        .isString().withMessage('El campo contraseña debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),
    
    handleValidationErrors
];

module.exports = {
    validatorUserCreate,
    validatorUserUpdate
};