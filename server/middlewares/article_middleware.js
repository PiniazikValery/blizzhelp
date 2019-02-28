const Article = require('../models/blog/article');
const User = require('../models/account/user');

const user = new User();
const article = new Article();

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
