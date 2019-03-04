const Article = require('../../models/blog/article');

const article = new Article();

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
