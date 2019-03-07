const express = require('express');

const router = express.Router();

const articleController = require('../controllers/articleController');

router.get('/page=:page&topic=:topic', articleController.get_articles);

module.exports = router;
