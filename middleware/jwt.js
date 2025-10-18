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
        if (decoded.usuario.perfil_id === 1) {
            next();
        }
        else {
            return res.status(403).send({ message: 'Sin autorización' });
        }

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
        if (decoded) {
            next();
        }
        else {
            return res.status(403).send({ message: 'Sin autorización' });
        }

    });
}


module.exports = {
    authenticateAdmin,
    authenticateAny
};