const express = require('express');

const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const authMiddleware = require('../../middlewares/authentication_middleware');

const router = express.Router();

const blogController = require('../controllers/blog_Controller');

const articleImageStorage = new ArticleImageStorage();

router.post('/article', authMiddleware.apiRequiresToBeAdmin, blogController.createArticle);
router.delete('/article/:id', authMiddleware.apiRequiresToBeAdmin, blogController.deleteArticle);
router.put('/article/:id', authMiddleware.apiRequiresToBeAdmin, blogController.updateArticle);
router.put('/article_image/:id', authMiddleware.apiRequiresToBeAdmin, articleImageStorage.getUpload().single('file'), blogController.setImageToArticle);

module.exports = router;
