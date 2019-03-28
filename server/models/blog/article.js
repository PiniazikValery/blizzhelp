const mongoose = require('mongoose');
const ArticleSchema = require('../../schemes/blog/article');
const ArticleContent = require('./articleContent');

class Article {
  constructor() {
    this.article = mongoose.model('Article', ArticleSchema);
    this.articleContent = new ArticleContent();
  }

  createArticle(articleData, callback) {
    this.article.create(articleData, (err, content) => {
      callback(err, content);
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
    this.article.findOne({
      _id: id,
    })
      .populate('fullContent')
      .exec((findErr, article) => {
        if (findErr) {
          callback(findErr);
        } else {
          article.updateOne({
            $set: {
              title: articleData.title,
              autor: articleData.autor,
              topic: articleData.topic,
              updateDate: articleData.updateDate,
              preViewContent: articleData.preViewContent,
              article_image: articleData.article_image,
            },
          }, (updateErr) => {
            if (updateErr) {
              callback(updateErr);
            } else {
              article.fullContent.updateOne({
                $set: {
                  content: articleData.content,
                },
              }, (updateContentErr) => {
                callback(updateContentErr);
              });
            }
          });
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

  getArticlesByPage(_page, _topic, callback) {
    if (_topic.toLowerCase() === 'any') {
      this.article.paginate({ }, { page: _page, limit: 10, sort: { createDate: -1 } }, (err, result) => {
        callback(err, result);
      });
    } else {
      this.article.paginate({ topic: _topic }, { page: _page, limit: 10, sort: { createDate: -1 } }, (err, result) => {
        callback(err, result);
      });
    }
  }

  getArticleContent(articleId, callback) {
    this.article.findOne({
      _id: articleId,
    })
      .populate('fullContent')
      .exec((findErr, article) => {
        if (article !== undefined) {
          callback(findErr, article.fullContent.content);
        } else {
          callback(findErr);
        }
      });
  }
}

module.exports = Article;
