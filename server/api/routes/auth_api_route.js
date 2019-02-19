const express = require('express');

const router = express.Router();

const authApiController = require('../controllers/auth_controller');

const emailVerificatorController = require('../controllers/email_verificator_controller');

router.post('/user', authApiController.create_user);
router.post('/user/login', authApiController.auth_user);
router.delete('/user/logout', authApiController.logout_user);
router.get('/user/isauthenticated', authApiController.is_user_authenticated);
router.post('/verifyUser', emailVerificatorController.createEmailCode);

module.exports = router;
