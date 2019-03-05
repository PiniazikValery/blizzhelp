const express = require('express');

const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const authMiddleware = require('../../middlewares/authentication_middleware');

const articleMiddleware = require('../../middlewares/article_middleware');

const router = express.Router();

const blogController = require('../controllers/blog_Controller');

const articleImageStorage = new ArticleImageStorage();

router.post(
  '/article',
  authMiddleware.apiRequiresToBeAdmin,
  blogController.createArticle,
);
router.delete(
  '/article/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  blogController.deleteArticle,
);
router.put(
  '/article/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  blogController.updateArticle,
);
router.put(
  '/article_image/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  articleMiddleware.deleteExistingArticleImage,
  articleImageStorage.getUpload().single('file'),
  articleMiddleware.handleFileUploadError,
  blogController.setImageToArticle,
);

router.post(
  '/article_content/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  blogController.setContentToArticle,
);

router.delete(
  '/article_content/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  blogController.deleteArticleContent,
);

router.put(
  '/article_content/:id',
  authMiddleware.apiRequiresToBeAdmin,
  articleMiddleware.requiresExistingArticle,
  articleMiddleware.requiresToBeCreatorOrSuperAdmin,
  blogController.updateArticleContent,
);

router.get(
  '/articles/page=:page&topic=:topic',
  blogController.getArticlesByPage,
);

router.get(
  '/article_image/:id',
  blogController.getArticleImage,
);

router.get(
  '/article/:id',
  blogController.getArticle,
);

router.get(
  '/article_content/:id',
  blogController.getArticleContent,
);

module.exports = router;
