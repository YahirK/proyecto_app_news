const { User } = require('../config/db');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const login = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    // Buscar usuario por correo y que esté activo
    User.findOne({
        where: {
            correo: request.body.correo,
            activo: true
        }
    }).then(usuario => {
        if (!usuario) {
            return response.status(401).json({ message: "Sin autorización" });
        }

        // Comparar contraseña con bcrypt
        const match = bcrypt.compareSync(request.body.contraseña, usuario.contraseña);
        if (!match) {
            return response.status(401).json({ message: "Sin autorización" });
        }

        // Preparar datos públicos para el token (no incluir contraseña)
        const payloadUser = {
            id: usuario.id,
            perfil_id: usuario.perfil_id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            nick: usuario.nick
        };

        const token = jwt.sign({ usuario: payloadUser }, 'mi_llave_secreta', { expiresIn: '24h' });
        response.status(200).json({ message: "Login con éxito", token: token });

    })
        .catch(err => {
            response.status(500).send('Error al consultar el dato');
        })
}


const register = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    // Asegurar que usamos los nombres de columna esperados por el modelo
    request.body.perfil_id = 2;
    request.body.activo = true;

    // Hashear la contraseña antes de guardar
    if (request.body.contraseña) {
        const salt = bcrypt.genSaltSync(10);
        request.body.contraseña = bcrypt.hashSync(request.body.contraseña, salt);
    }

    // Valores requeridos por el modelo: UserAlta y FechaAlta
    // Proveer valores por defecto si no vienen desde el cliente
    request.body.UserAlta = request.body.nick || 'system';
    request.body.FechaAlta = request.body.FechaAlta || new Date();
    // Evitar errores por columnas que en la BD requieren valor (UserMod/FechaMod)
    request.body.UserMod = request.body.UserMod || request.body.nick || 'system';
    request.body.FechaMod = request.body.FechaMod || new Date();
    // Asegurar campos de baja aunque normalmente sean nulos
    request.body.UserBaja = request.body.UserBaja || null;
    request.body.FechaBaja = request.body.FechaBaja || null;

    User.create(request.body).then(
        newEntitie => {
            // No devolver la contraseña en la respuesta
            if (newEntitie && newEntitie.dataValues) {
                delete newEntitie.dataValues.contraseña;
            }
            response.status(201).json(newEntitie)
        }
    )
        .catch(err => {
            console.error('Error creating user:', err);
            // En desarrollo devolvemos el mensaje de error para depuración
            const msg = err && err.message ? err.message : 'Error al crear';
            response.status(500).json({ error: msg });
        })
}




module.exports = {
    login,
    register,
};