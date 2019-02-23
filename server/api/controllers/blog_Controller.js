const Article = require('../../models/blog/article');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const articleImageStorage = new ArticleImageStorage();

const article = new Article();

exports.createArticle = (req, res) => {
  article.createArticle(req.body.title, req.file.id, req.session.userId, req.body.content, (err) => {
    if (err) {
      articleImageStorage.deleteFileById(req.file.id);
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: `article ${req.body.title} successfully created`,
      });
    }
  });
};
