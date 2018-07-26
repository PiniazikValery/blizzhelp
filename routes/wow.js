var express = require('express');
var router = express.Router();

var wowController = require('../controllers/wowController');

router.get('/',wowController.get_wow);

module.exports = router;