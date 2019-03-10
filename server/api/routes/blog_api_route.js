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
  articleImageStorage.getUpload().single('file'),
  articleMiddleware.handleFileUploadError,
  blogController.createArticle,
  articleMiddleware.handleCreateArticleErrors,
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
  blogController.casheArticleBeforeUpdate,
  articleImageStorage.getUpload().single('file'),
  articleMiddleware.handleFileUploadError,
  blogController.updateArticleImage,
  blogController.updateArticle,
  blogController.updateArticleContent,
  blogController.articleSuccessfullyUpdated,
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
