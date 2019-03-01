const mongoose = require('mongoose');
const ArticleContentSchema = require('../../schemes/blog/articleContent');

class ArticleContent {
  constructor() {
    this.articleContent = mongoose.model('ArticleContent', ArticleContentSchema);
  }

  createArticleContent(_content, callback) {
    const articleContentData = {
      content: _content,
    };
    this.articleContent.create(articleContentData, (err, resultContent) => {
      callback(err, resultContent);
    });
  }

  deleteArticleContent(id, callback) {
    this.articleContent.deleteOne({ _id: id }, (err) => {
      callback(err);
    });
  }

  updateArticleContent(id, _content, callback) {
    const articleContentData = {
      content: _content,
    };
    this.articleContent.findByIdAndUpdate(id, articleContentData, (err) => {
      callback(err);
    });
  }
}

module.exports = ArticleContent;
