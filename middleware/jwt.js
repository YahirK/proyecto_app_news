const jwt = require('jsonwebtoken');


const authenticateAdmin = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    const token = authorization_header && authorization_header.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, 'mi_llave_secreta', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Sin autorización' });
        }
        // Attach decoded user to request for downstream handlers
        if (decoded && decoded.usuario) {
            req.user = decoded.usuario;
            if (decoded.usuario.perfil_id === 1) {
                return next();
            }
        }
        return res.status(403).send({ message: 'Sin autorización' });

    });
}

const authenticateAny = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    const token = authorization_header && authorization_header.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, 'mi_llave_secreta', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Sin autorización' });
        }
        if (decoded && decoded.usuario) {
            req.user = decoded.usuario;
            return next();
        }
        return res.status(403).send({ message: 'Sin autorización' });

    });
}


module.exports = {
    authenticateAdmin,
    authenticateAny
};