const express = require('express');

const router = express.Router();

const wowController = require('../controllers/wowController');

router.get('/', wowController.get_wow);

router.get('/tanking_guide', wowController.get_tanking_guide);

module.exports = router;
