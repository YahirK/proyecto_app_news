// controllers/categoryController.js
const { Category } = require('../config/db'); // Importar el modelo de Sequelize
const { Op } = require('sequelize');

// @desc    Obtener todas las categorias
// @route   GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        const { nombre, descripcion } = req.query;
        const where = { activo: true };

        if (nombre) {
            where.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (descripcion) {
            where.descripcion = { [Op.like]: `%${descripcion}%` };
        }

        const categories = await Category.findAll({ where });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener categorías' });
    }
};

// @desc    Obtener una categoria por ID
// @route   GET /api/categories/:id
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Crear una nueva categoria
// @route   POST /api/categories
const createCategory = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const newCategory = await Category.create({
            nombre,
            descripcion
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

// @desc    Actualizar una categoria
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        // --- INICIO DE DEPURACIÓN ---
        console.log('ID a actualizar:', req.params.id);
        console.log('Datos recibidos para actualizar:', req.body);
        // --- FIN DE DEPURACIÓN ---

        await Category.update(req.body, {
            where: { id: req.params.id }
        });

        // Volvemos a buscar para devolver el objeto actualizado
        const updatedCategory = await Category.findByPk(req.params.id);

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
};

// @desc    Eliminar una categoria (baja lógica)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const [updated] = await Category.update({ activo: false }, {
            where: { id: req.params.id }
        });
        const category = updated > 0;
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría desactivada' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al desactivar la categoría' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};