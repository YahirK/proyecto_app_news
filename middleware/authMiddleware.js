// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../config/db'); // Importar el modelo de Sequelize

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del token y adjuntarlo al request con Sequelize
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['contraseña'] } // Excluir contraseña
            });
            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'No autorizado, token falló' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

const admin = (req, res, next) => {
    // Asumimos que el profile_id para Admin es 1
    if (req.user && req.user.profile_id === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, requiere rol de Administrador' });
    }
};

module.exports = { protect, admin };