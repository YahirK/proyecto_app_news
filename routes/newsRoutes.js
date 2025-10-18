// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const { getAllNews, getNewsById, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { authenticateAny } = require('../middleware/jwt');
const { validatorNewCreate, validatorNewUpdate } = require('../controllers/NewValidator');

router.route('/')
    .get(getAllNews) // Pública
    .post(authenticateAny, validatorNewCreate, createNews); // Solo usuarios logeados (Contribuidor/Admin)

router.route('/:id')
    .get(getNewsById) // Pública
    .put(authenticateAny, validatorNewUpdate, updateNews) // Solo el autor o un admin
    .delete(authenticateAny, deleteNews); // Solo Admins

module.exports = router;