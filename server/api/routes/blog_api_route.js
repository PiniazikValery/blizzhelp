const express = require('express');

const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');
const CloudinaryImageStorage = require('../../models/fileStorageFacilities/cloudinaryImageStorage');
const authMiddleware = require('../../middlewares/authentication_middleware');
const articleMiddleware = require('../../middlewares/article_middleware');
const blogController = require('../controllers/blog_Controller');

const router = express.Router();
const articleImageStorage = new ArticleImageStorage();
const cloudinaryImageStorage = new CloudinaryImageStorage();

router.post(
  '/article',
  authMiddleware.apiRequiresToBeAdmin,
  articleImageStorage.getUpload().single('file'),
  articleMiddleware.handleMaxFileSizeError,
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
  articleImageStorage.getUpload().single('file'),
  articleMiddleware.handleMaxFileSizeError,
  articleMiddleware.handleFileUploadError,
  articleMiddleware.deleteExistingArticleImage,
  blogController.updateArticle,
  articleMiddleware.handleUpdateArticleErrors,
);

router.post(
  '/uploadBlogImg',
  authMiddleware.apiRequiresToBeAdmin,
  cloudinaryImageStorage.getParser().single('file'),
  blogController.uploadBlogImg,
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

router.get(
  '/avaliable_topics',
  blogController.getAvaliableTopics,
);

router.post(
  '/comment',
  authMiddleware.apiRequiresLogin,
  blogController.uploadComment,
);

router.get(
  '/comment/:articleName',
  blogController.getComments,
);

module.exports = router;
