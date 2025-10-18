// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { authenticateAdmin } = require('../middleware/jwt');
const { validatorCategoryCreate, validatorCategoryUpdate } = require('../controllers/CategoryValidator');

// Rutas públicas (solo lectura)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Rutas protegidas (solo para administradores)
router.post('/', authenticateAdmin, validatorCategoryCreate, createCategory);
router.put('/:id', authenticateAdmin, validatorCategoryUpdate, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

module.exports = router;