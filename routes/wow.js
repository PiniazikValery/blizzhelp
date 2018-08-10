var express = require('express');
var router = express.Router();

var wowController = require('../controllers/wowController');

router.get('/',wowController.get_wow);

router.get('/tanking_guide',wowController.get_tanking_guide);

router.get('/testDb',wowController.test);

module.exports = router;