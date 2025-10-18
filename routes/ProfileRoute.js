// routes/ProfileRoute.js
const express = require('express');
const router = express.Router();
const {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile
} = require('../controllers/ProfileController');
const { authenticateAdmin } = require('../middleware/jwt');

router.route('/').get(authenticateAdmin, getAllProfiles).post(authenticateAdmin, createProfile);
router.route('/:id').get(authenticateAdmin, getProfileById).put(authenticateAdmin, updateProfile);

module.exports = router;