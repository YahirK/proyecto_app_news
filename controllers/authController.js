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

        // Comparar contraseña con bcrypt. Si la contraseña en la BD está en texto
        // plano (legacy), permitimos la comparación directa una vez y re-hasheamos
        // la contraseña en la base de datos para futuras conexiones.
        let match = false;
        try {
            match = bcrypt.compareSync(request.body.contraseña, usuario.contraseña);
        } catch (e) {
            match = false;
        }

        const proceedWithLogin = (userInstance) => {
            // Preparar datos públicos para el token (no incluir contraseña)
            const payloadUser = {
                id: userInstance.id,
                perfil_id: userInstance.perfil_id,
                nombre: userInstance.nombre,
                apellidos: userInstance.apellidos,
                nick: userInstance.nick
            };

            const token = jwt.sign({ usuario: payloadUser }, 'mi_llave_secreta', { expiresIn: '24h' });
            response.status(200).json({ message: "Login con éxito", token: token });
        };

        if (match) {
            return proceedWithLogin(usuario);
        }

        // Fallback: si la contraseña almacenada parece no estar hasheada, comprobar igualdad directa
        // (esto soporta cuentas antiguas creadas en texto plano). Si coincide, hasheamos y actualizamos.
        if (request.body.contraseña === usuario.contraseña) {
            const salt = bcrypt.genSaltSync(10);
            const newHash = bcrypt.hashSync(request.body.contraseña, salt);
            usuario.update({ contraseña: newHash }).then(updated => {
                return proceedWithLogin(updated);
            }).catch(err => {
                console.error('Error updating legacy password to hash:', err);
                return response.status(500).json({ error: 'Error al actualizar la contraseña' });
            });
            return;
        }

        return response.status(401).json({ message: "Sin autorización" });

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
    // Evitar error si la BD no acepta NULL en campos de baja: dar valores por defecto
    request.body.UserBaja = request.body.UserBaja || request.body.nick || 'system';
    request.body.FechaBaja = request.body.FechaBaja || new Date();

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