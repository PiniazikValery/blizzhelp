const Article = require('../../models/blog/article');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const article = new Article();
const articleImageStorage = new ArticleImageStorage();

exports.createArticle = (req, res, next) => {
  article.createArticle({
    title: req.body.title,
    autor: req.session.userId,
    topic: req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent,
  }, (err, createArticle) => {
    if (err) {
      articleImageStorage.deleteFileById(req.file.id, () => {
        res.status(422).json({
          message: 'Unable to create article',
          error: err.message,
        });
      });
    } else {
      req.createArticle = createArticle;
      next();
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

exports.updateArticle = (req, res, next) => {
  article.updateArticle(req.params.id, {
    title: req.body.title,
    autor: req.session.userId,
    topic: req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent,
  }, (err) => {
    if (err) {
      res.status(422).json({
        message: 'Unable to update article',
        error: err.message,
      });
    } else {
      next();
    }
  });
};

exports.casheArticleBeforeUpdate = (req, res, next) => {
  article.getArticleById(req.params.id, (err, savedArticle) => {
    if (err) {
      res.status(404).json({
        message: 'Some error occure while fetching article',
        error: err.message,
      });
    } else {
      req.savedArticle = savedArticle;
      next();
    }
  });
};

exports.updateArticleImage = (req, res, next) => {
  article.setImageToArticle(req.params.id, req.file.id, (err) => {
    if (err) {
      articleImageStorage.deleteFileById(req.file.id, () => {
        res.status(422).json('Unable to update article image');
      });
    } else {
      articleImageStorage.deleteFileById(req.savedArticle.article_image, () => {
        next();
      });
    }
  });
};

exports.updateArticleContent = (req, res, next) => {
  article.updateArticleContent(req.params.id, req.body.content, (err) => {
    if (err) {
      res.status(422).json({
        message: 'Unable to update article content',
        error: err.message,
      });
    } else {
      next();
    }
  });
};

exports.setImageToArticle = (req, res, next) => {
  article.setImageToArticle(req.createArticle.id, req.file.id, (err) => {
    if (err) {
      article.deleteArticle(req.createArticle.id, () => {
        res.status(422).json({
          message: 'Unable to upload image',
          error: err.message,
        });
      });
    } else {
      next();
    }
  });
};

exports.setContentToArticle = (req, res, next) => {
  article.setContentToArticle(req.createArticle.id, req.body.content, (err) => {
    if (err) {
      article.deleteArticle(req.createArticle.id, () => {
        res.status(500).json({
          message: 'Unable to create content of the article',
          error: err.message,
        });
      });
    } else {
      next();
    }
  });
};

exports.articleSuccessfullyCreated = (req, res) => {
  res.status(200).json({
    message: 'Artile has been successfully created',
    articleId: req.createArticle.id,
  });
};

exports.articleSuccessfullyUpdated = (req, res) => {
  res.status(200).json({
    message: 'Artile has been successfully updated',
    articleId: req.params.id,
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
