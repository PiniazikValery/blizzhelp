var express = require('express');
var router = express.Router();

var wowController = require('../controllers/wowController');

router.get('/',wowController.get_wow);

router.get('/tanking_guide',wowController.get_tanking_guide);

router.get('/testDb',wowController.test);

router.get('/testDb2',wowController.test2);

module.exports = router;