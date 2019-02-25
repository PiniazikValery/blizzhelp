const mongoose = require('mongoose');
const ArticleSchema = require('../../schemes/blog/article');

class Article {
  constructor() {
    this.article = mongoose.model('Article', ArticleSchema);
  }

  createArticle(_title, articleImage, _autor, _content, callback) {
    const articleData = {
      title: _title,
      article_image: articleImage,
      autor: _autor,
      updateDate: new Date(),
      content: _content,
    };
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
        callback(new Error('article not found'));
      }
    });
  }
}

module.exports = Article;
