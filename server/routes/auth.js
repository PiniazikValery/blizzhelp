const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.get('/registration', authController.get_registration_page);

module.exports = router;
