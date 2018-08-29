var express = require('express');
var router = express.Router();

var auth_api=require('../controllers/auth_controller');

router.post('/user',auth_api.create_user);
router.post('/user/login',auth_api.auth_user);
router.delete('/user/logout',auth_api.logout_user);

module.exports = router;