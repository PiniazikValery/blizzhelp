const mongoose = require('mongoose');
const ArticleSchema = require('../../schemes/blog/article');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const articleImageStorage = new ArticleImageStorage();

class Article {
  constructor() {
    this.article = mongoose.model('Article', ArticleSchema);
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
    this.article.findByIdAndUpdate(id, articleData, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
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
    this.getArticleById(articleId, (err, content) => {
      if (!err) {
        this.article.findByIdAndUpdate(articleId, { article_image: imageId }, (errUpdate) => {
          if (!errUpdate) {
            if (content.article_image !== null) {
              articleImageStorage.deleteFileById(content.article_image, (deleteImageError) => {
                if (!deleteImageError) {
                  callback(err);
                } else {
                  callback(deleteImageError);
                }
              });
            } else {
              callback(err);
            }
          } else {
            callback(errUpdate);
          }
        });
      } else {
        callback(err);
      }
    });
  }
}

module.exports = Article;
