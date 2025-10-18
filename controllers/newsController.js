// controllers/newsController.js
const { News, User, Category, State } = require('../config/db'); // Importamos los modelos de Sequelize

/**
 * @desc    Obtener todas las noticias APROBADAS y activas
 * @route   GET /api/news
 */
const getAllNews = async (req, res) => {
    try {
        const approvedNews = await News.findAll({
            where: { status: 'aprobada', activo: true },
            include: [
                { model: User, as: 'usuario', attributes: ['nombres', 'apellidos'] },
                { model: Category, as: 'categoria', attributes: ['nombre'] },
                { model: State, as: 'estado', attributes: ['nombre'] }
            ],
            order: [
                ['createdAt', 'DESC'] // Equivalente a sort
            ]
        });
        res.json(approvedNews);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener noticias', error: error.message });
    }
};

/**
 * @desc    Obtener una noticia por su ID
 * @route   GET /api/news/:id
 */
const getNewsById = async (req, res) => {
    try {
        const notice = await News.findByPk(req.params.id); // findByPk busca por clave primaria
        if (notice) {
            res.json(notice);
        } else {
            res.status(404).json({ message: 'Noticia no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener la noticia', error: error.message });
    }
};

/**
 * @desc    Crear una nueva noticia (queda como 'pendiente' por defecto)
 * @route   POST /api/news
 */
const createNews = async (req, res) => {
    const { categoria_id, estado_id, titulo, description, image } = req.body;
    try {
        const newNotice = await News.create({
            categoria_id,
            estado_id,
            titulo,
            description,
            imagen: image, // Asegurarse que el nombre del campo coincida con el modelo
            usuario_id: req.user.id, // El ID viene del middleware 'protect' (Sequelize usa 'id')
        });
        res.status(201).json(newNotice);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la noticia', error: error.message });
    }
};

/**
 * @desc    Actualizar una noticia por su ID
 * @route   PUT /api/news/:id
 */
const updateNews = async (req, res) => {
    try {
        const noticeId = req.params.id;
        const notice = await News.findByPk(noticeId);

        if (!notice) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        // Verificación: Solo el autor original o un admin pueden editar
        if (notice.usuario_id !== req.user.id && req.user.profile_id !== 1) { // Asumiendo que 1 es el ID del perfil de Admin
            return res.status(403).json({ message: 'No autorizado para editar esta noticia' });
        }

        // El método update devuelve un array con el número de filas afectadas.
        const [updatedRows] = await News.update(req.body, {
            where: { id: noticeId }
        });

        if (updatedRows === 0) {
            // Esto es poco probable si ya lo encontramos, pero es una buena práctica.
            return res.status(404).json({ message: 'Noticia no encontrada para actualizar' });
        }

        const updatedNotice = await News.findByPk(noticeId); // Volvemos a buscar para devolver el objeto completo.
        
        res.json(updatedNotice);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la noticia', error: error.message });
    }
};

/**
 * @desc    Eliminar una noticia por su ID (solo Admins)
 * @route   DELETE /api/news/:id
 */
const deleteNews = async (req, res) => {
    try {
        // Usando el método estático destroy, que devuelve el número de filas eliminadas.
        const numRowsDeleted = await News.destroy({
            where: { id: req.params.id }
        });

        if (numRowsDeleted === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        // Para una baja lógica, usarías: await News.update({ activo: false }, { where: { id: req.params.id } });

        res.json({ message: 'Noticia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al eliminar la noticia' });
    }
};

// ¡IMPORTANTE! Exportar todas las funciones
module.exports = {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};