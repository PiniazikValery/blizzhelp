const Article = require('../models/blog/article');
const User = require('../models/account/user');
const ArticleImageStorage = require('../models/fileStorageFacilities/articleImageStorage');

const user = new User();
const article = new Article();
const articleImageStorage = new ArticleImageStorage();

exports.requiresExistingArticle = (req, res, next) => {
  article.getArticleById(req.params.id, (err) => {
    if (err) {
      res.status(401).json({ error: 'Article not found' });
    } else {
      next();
    }
  });
};

exports.requiresToBeCreatorOrSuperAdmin = (req, res, next) => {
  article.getArticleById(req.params.id, (err, content) => {
    user.getUserById(req.session.userId, (findUserErr) => {
      if (findUserErr) {
        res.status(500).json({ error: err.message });
      }
    }).then((foundUser) => {
      if (!foundUser.user_role.toLowerCase().includes('superadmin')) {
        if (content.autor.equals(foundUser.id)) {
          next();
        } else {
          res.status(403).json({ error: 'You must be a creator of this article to do this' });
        }
      } else {
        next();
      }
    });
  });
};

exports.deleteExistingArticleImage = (req, res, next) => {
  article.getArticleById(req.params.id, (err, foundArticle) => {
    if (!err) {
      if (foundArticle.article_image !== null) {
        articleImageStorage.deleteFileById(foundArticle.article_image, (errDelete) => {
          if (errDelete) {
            next(errDelete);
          } else {
            foundArticle.updateOne({ $set: { article_image: null } }, (updateErr) => {
              next(updateErr);
            });
          }
        });
      } else {
        next();
      }
    } else {
      next(err);
    }
  });
};

exports.handleFileUploadError = (req, res, next) => {
  if (req.fileValidationError) {
    res.status(412).json({ error: 'Wrong file type' });
  } else {
    next();
  }
};
