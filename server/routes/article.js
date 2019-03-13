const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authentication_middleware');

const articleController = require('../controllers/articleController');

router.get('/page=:page&topic=:topic', articleController.get_articles);

router.get(
  '/createArticle',
  authMiddleware.requiresToBeAdmin,
  articleController.get_create_article,
);

module.exports = router;
