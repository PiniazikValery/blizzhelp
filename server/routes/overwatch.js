const express = require('express');

const router = express.Router();

const overwatchController = require('../controllers/overwatchController');

router.get('/', overwatchController.get_overwatch);

module.exports = router;
