const mongoose = require('mongoose');
const Article = require('../../models/blog/article');
const Comment = require('../../models/blog/comment');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');
const articleContentSchema = require('../../schemes/blog/articleContent');
const OembedParser = require('../../htmlParsers/oembedParser');
const config = require('../../config');

const ArticleContent = mongoose.model('ArticleContent', articleContentSchema);
const article = new Article();
const comment = new Comment();
const oembedParser = new OembedParser();
const articleImageStorage = new ArticleImageStorage();

exports.createArticle = (req, res, next) => {
  article.createArticle({
    title: req.body.title,
    autor: req.session.userId,
    topic: req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent,
    fullContent: new ArticleContent({
      content: req.body.content,
    }),
    article_image: req.file.id,
  }, (err, createArticle) => {
    if (err) {
      req.createArticleError = err;
      next();
    } else {
      res.status(201).json({
        message: 'Artile has been successfully created',
        articleId: createArticle.id,
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

exports.updateArticle = (req, res, next) => {
  article.updateArticle(req.params.id, {
    title: req.body.title === undefined ? 'No title' : req.body.title,
    autor: req.session.userId,
    topic: req.body.topic === undefined ? 'No topic' : req.body.topic,
    updateDate: new Date(),
    preViewContent: req.body.preViewContent === undefined ? 'No preview content' : req.body.preViewContent,
    article_image: req.file.id,
    content: req.body.content === undefined ? 'No content' : req.body.content,
  }, (err) => {
    if (err) {
      req.updateArticleError = err;
      next();
    } else {
      res.status(200).json({
        message: 'Artile has been successfully updated',
        articleId: req.params.id,
      });
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
      res.status(200).json({ content: oembedParser.parseOembeds(result) });
    }
  });
};

exports.getAvaliableTopics = (req, res) => {
  res.status(200).json(config.get('avaliableTopics'));
};

exports.uploadBlogImg = (req, res) => {
  if (req.file) {
    res.status(200).json({
      uploaded: true,
      url: req.file.url,
    });
  } else {
    res.status(500).json({
      uploaded: false,
      error: {
        message: 'could not upload this image',
      },
    });
  }
};

exports.uploadComment = (req, res) => {
  comment.createComment(
    {
      article: req.body.article,
      content: req.body.content,
      sender: req.session.userId,
    },
    (err, result) => {
      if (err) {
        res.status(500).json({
          error: {
            message: err.message,
          },
        });
      } else {
        res.status(201).json({
          message: 'Comment successfuly posted',
          comment: result,
        });
      }
    },
  );
};

exports.getComments = (req, res) => {
  comment.getCommentsByArticle(req.params.articleName, (err, foundComments) => {
    if (err) {
      res.status(500).json({
        error: {
          message: 'Some error occure while finding comments',
        },
      });
    } else {
      res.status(200).json({
        message: 'Comments have been found',
        comments: foundComments,
      });
    }
  });
};
