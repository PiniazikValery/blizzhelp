const Article = require('../models/blog/article');

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
