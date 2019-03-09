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
  }, (setArticleErr, content) => {
    if (setArticleErr) {
      req.createArticleError = {
        errorType: 'articleUploadError',
        error: setArticleErr,
      };
      next();
    } else {
      article.setImageToArticle(content.id, req.file.id, (setImageErr) => {
        if (setImageErr) {
          req.createArticleError = {
            errorType: 'imageUploadError',
            articleId: content.id,
            error: setImageErr,
          };
          next();
        } else {
          article.setContentToArticle(content.id, req.body.content, (setContentErr) => {
            if (setContentErr) {
              req.createArticleError = {
                errorType: 'contentUploadError',
                articleId: content.id,
                error: setContentErr,
              };
              next();
            } else {
              res.status(201).json({ message: `Added article with id ${content.id}` });
            }
          });
        }
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
  article.getArticleById(req.params.id, (getArticleErr, content) => {
    if (getArticleErr) {
      req.updateArticleError = {
        errorType: 'getArticleError',
        error: getArticleErr,
      };
      next();
    } else {
      req.originContent = content;
      article.updateArticle(req.params.id, {
        title: req.body.title,
        autor: req.session.userId,
        topic: req.body.topic,
        updateDate: new Date(),
        preViewContent: req.body.preViewContent,
      }, (updateArticleErr, updatedContent) => {
        if (updateArticleErr) {
          req.updateArticleError = {
            errorType: 'articleUpdareError',
            articleId: req.params.id,
            error: updateArticleErr,
          };
          next();
        } else {
          article.setImageToArticle(req.params.id, req.file.id, (updateImageErr) => {
            if (!updateImageErr) {
              if (updatedContent.fullContent === null) {
                article.setContentToArticle(req.params.id, req.body.content, (setContentErr) => {
                  if (setContentErr) {
                    req.updateArticleError = {
                      errorType: 'contentUploadError',
                      articleId: req.params.id,
                      error: setContentErr,
                    };
                    next();
                  } else {
                    res.status(201).json({ message: `Updated article with id ${req.params.id}` });
                  }
                });
              } else {
                article.updateArticleContent(req.params.id, req.body.content, (updateContentErr) => {
                  if (updateContentErr) {
                    req.updateArticleError = {
                      errorType: 'contentUpdateError',
                      articleId: req.params.id,
                      error: updateContentErr,
                    };
                    next();
                  } else {
                    res.status(201).json({ message: `Updated article with id ${req.params.id}` });
                  }
                });
              }
            } else {
              req.updateArticleError = {
                errorType: 'imageUpdateError',
                articleId: req.params.id,
                error: updateImageErr,
              };
            }
          });
        }
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
      res.status(500).json({ error: err });
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
