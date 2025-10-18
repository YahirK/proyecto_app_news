// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');
const { authenticateAdmin } = require('../middleware/jwt');
const { validatorUserCreate, validatorUserUpdate } = require('../controllers/UserValidator');

// Todas las rutas en este archivo requieren ser admin
router.use(authenticateAdmin);

router.route('/').get(getAllUsers).post(validatorUserCreate, createUser);
router.route('/:id').get(getUserById).put(validatorUserUpdate, updateUser).delete(deleteUser);

module.exports = router;