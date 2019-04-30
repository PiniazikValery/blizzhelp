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
}

module.exports = ArticleContent;
