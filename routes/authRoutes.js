var express = require('express');

const { login, register } = require('../controllers/authController');
const { validatorLogin, validatorRegister } = require('../controllers/AuthValidator');
const router = express.Router();

router.post('/login', validatorLogin, login);
router.post('/registro', validatorRegister, register);

module.exports = router;