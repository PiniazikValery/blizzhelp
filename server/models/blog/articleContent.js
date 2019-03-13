const mongoose = require('mongoose');
const ArticleContentSchema = require('../../schemes/blog/articleContent');

class ArticleContent {
  constructor() {
    this.articleContent = mongoose.model('ArticleContent', ArticleContentSchema);
  }

  createArticleContent(articleContentData, callback) {
    this.articleContent.create(articleContentData, (err, resultContent) => {
      callback(err, resultContent);
    });
  }

  getArticleContentByArticleId(_articleId, callback) {
    this.articleContent.findOne({ articleId: _articleId }, (err, result) => {
      if (result !== undefined) {
        callback(err, result);
      } else {
        callback(new Error('Content not found'), null);
      }
    });
  }
}

module.exports = ArticleContent;
