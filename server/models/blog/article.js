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
    this.article.remove({ _id: id }, (err) => {
      callback(err);
    });
  }
}

module.exports = Article;
