const mongoose = require('mongoose');
const ArticleSchema = require('../../schemes/blog/article');
const ArticleContent = require('./articleContent');

class Article {
  constructor() {
    this.article = mongoose.model('Article', ArticleSchema);
    this.articleContent = new ArticleContent();
  }

  createArticle(articleData, callback) {
    this.article.create(articleData, (err) => {
      callback(err);
    });
  }

  deleteArticle(id, callback) {
    this.article.findOne({ _id: id }, (err, content) => {
      if (content) {
        if (err) {
          callback(err);
        } else {
          content.remove((errDelete) => {
            if (errDelete) {
              callback(errDelete);
            } else {
              callback();
            }
          });
        }
      } else {
        callback(new Error('Article not found'));
      }
    });
  }

  updateArticle(id, articleData, callback) {
    this.article.findOne({ _id: id }, (err, content) => {
      if (content) {
        if (err) {
          callback(err);
        } else {
          content.updateOne(articleData, (updateErr) => {
            if (updateErr) {
              callback(updateErr);
            } else {
              callback();
            }
          });
        }
      } else {
        callback(new Error('Article not found'));
      }
    });
  }

  getArticleById(id, callback) {
    this.article.findById(id, (err, content) => {
      if (content) {
        callback(err, content);
      } else {
        callback(new Error('Article not found'), content);
      }
    });
  }

  setImageToArticle(articleId, imageId, callback) {
    this.article.findByIdAndUpdate(articleId, { article_image: imageId }, (errUpdate) => {
      callback(errUpdate);
    });
  }

  setContentToArticle(articleId, content, callback) {
    this.articleContent.createArticleContent(articleId, content, (createErr, createdContent) => {
      if (createErr) {
        callback(createErr);
      } else {
        this.getArticleById(articleId, (foundErr, foundContent) => {
          if (foundErr) {
            callback(foundErr);
          } else {
            foundContent.updateOne({ $set: { fullContent: createdContent.id } }, (updateErr) => {
              if (updateErr) {
                callback(updateErr);
              } else {
                callback();
              }
            });
          }
        });
      }
    });
  }

  deleteArticleContent(articleId, callback) {
    this.articleContent.deleteArticleContentByArticleId(articleId, (errDelete) => {
      if (errDelete) {
        callback(errDelete);
      } else {
        this.getArticleById(articleId, (foundErr, foundContent) => {
          if (foundErr) {
            callback(foundErr);
          } else {
            foundContent.updateOne({ $set: { fullContent: null } }, (updateErr) => {
              if (updateErr) {
                callback(updateErr);
              } else {
                callback();
              }
            });
          }
        });
      }
    });
  }

  updateArticleContent(articleId, content, callback) {
    this.articleContent.updateArticleContentByArticleId(articleId, content, (err) => {
      callback(err);
    });
  }
}

module.exports = Article;
