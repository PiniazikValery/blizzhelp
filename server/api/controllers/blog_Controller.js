const Article = require('../../models/blog/article');

const article = new Article();

exports.createArticle = (req, res) => {
  article.createArticle(req.body.title, req.file._id, req.session.userId, req.body.content, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: `article ${req.body.title} successfully created`,
      });
    }
  });
};
