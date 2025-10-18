// controllers/usersController.js
const { User } = require('../config/db'); // Importar el modelo de Sequelize
const { Op } = require('sequelize');

/**
 * @desc    Obtener todos los usuarios (Solo para Admins)
 * @route   GET /api/users
 */
const getAllUsers = async (req, res) => {
    try {
        const { nombre, apellidos, nick } = req.query;
        const where = {};

        if (nombre) {
            where.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (apellidos) {
            where.apellidos = { [Op.like]: `%${apellidos}%` };
        }
        if (nick) {
            where.nick = { [Op.like]: `%${nick}%` };
        }

        const users = await User.findAll({ where, attributes: { exclude: ['contraseña'] } }); // Excluir contraseñas
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al obtener usuarios' });
    }
};

/**
 * @desc    Obtener un usuario por su ID (Solo para Admins)
 * @route   GET /api/users/:id
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['contraseña'] } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Actualizar un usuario por su ID (Solo para Admins)
 * @route   PUT /api/users/:id
 */
const updateUser = async (req, res) => {
    try {
        const { nombre, apellidos, nick, contraseña } = req.body;

        const updatedFields = {
            UserMod: 'System',
            FechaMod: new Date()
        };

        if (nombre) updatedFields.nombre = nombre;
        if (apellidos) updatedFields.apellidos = apellidos;
        if (nick) updatedFields.nick = nick;
        if (contraseña) updatedFields.contraseña = contraseña;

        await User.update(updatedFields, {
            where: { id: req.params.id }
        });

        const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['contraseña'] } });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

/**
 * @desc    Eliminar un usuario (baja lógica) (Solo para Admins)
 * @route   DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        // Usamos `update` para una baja lógica
        const [updated] = await User.update({ 
            activo: false,
            UserBaja: 'System',
            FechaBaja: new Date()
         }, {
            where: { id: req.params.id }
        });
        const user = updated > 0; // Verificamos si se actualizó al menos una fila
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al desactivar el usuario' });
    }
};

const createUser = async (req, res) => {
    try {
        const { nombre, apellidos, nick, correo, contraseña, profile_id } = req.body;

        const newUser = await User.create({
            nombre,
            apellidos,
            nick,
            correo,
            contraseña,
            profile_id, // Asegúrate de que este campo se pasa correctamente
            UserAlta: 'System',
            FechaAlta: new Date()
        });

        const userResponse = newUser.toJSON();
        delete userResponse.contraseña;
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser
};