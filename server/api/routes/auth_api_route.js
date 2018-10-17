const express = require('express');

const router = express.Router();

const authApiController = require('../controllers/auth_controller');

router.post('/user', authApiController.create_user);
router.post('/user/login', authApiController.auth_user);
router.delete('/user/logout', authApiController.logout_user);
router.get('/user/isauthenticated', authApiController.is_user_authenticated);

module.exports = router;
