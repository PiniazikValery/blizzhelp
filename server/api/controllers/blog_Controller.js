const Article = require('../../models/blog/article');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const article = new Article();
const articleImageStorage = new ArticleImageStorage();

exports.createArticle = (req, res) => {
  article.createArticle({
    title: req.body.title,
    autor: req.session.userId,
    topic: req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent,
  }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: `article ${req.body.title} successfully created`,
      });
    }
  });
};

exports.deleteArticle = (req, res) => {
  article.deleteArticle(req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({
        message: `article with id ${req.params.id} has been successfully removed`,
      });
    }
  });
};

exports.updateArticle = (req, res) => {
  article.updateArticle(req.params.id, {
    title: req.body.title,
    autor: req.session.userId,
    topic: req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent,
  }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({
        message: `article with id ${req.params.id} has been successfully updated`,
      });
    }
  });
};

exports.setImageToArticle = (req, res) => {
  article.setImageToArticle(req.params.id, req.file.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: `Image added to the article with id ${req.params.id}` });
    }
  });
};

exports.setContentToArticle = (req, res) => {
  article.setContentToArticle(req.params.id, req.body.content, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: `Content added to the article with id ${req.params.id}` });
    }
  });
};

exports.deleteArticleContent = (req, res) => {
  article.deleteArticleContent(req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: `Content in article with id ${req.params.id} has been deleted` });
    }
  });
};

exports.updateArticleContent = (req, res) => {
  article.updateArticleContent(req.params.id, req.body.content, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: `Content in article with id ${req.params.id} has been updated` });
    }
  });
};

exports.getArticlesByPage = (req, res) => {
  article.getArticlesByPage(req.params.page, req.params.topic, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getArticleImage = (req, res) => {
  article.getArticleById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      articleImageStorage.getDownloadStreamOfFileById(result.article_image, (downloadStream) => {
        downloadStream.on('data', (chunk) => {
          res.write(chunk);
        });
        downloadStream.on('error', () => {
          res.sendStatus(404);
        });
        downloadStream.on('end', () => {
          res.end();
        });
      });
    }
  });
};

exports.getArticle = (req, res) => {
  article.getArticleById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getArticleContent = (req, res) => {
  article.getArticleContent(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ content: result });
    }
  });
};
