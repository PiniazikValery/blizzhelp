const mongoose = require('mongoose');
const ArticleContentSchema = require('../../schemes/blog/articleContent');

class ArticleContent {
  constructor() {
    this.articleContent = mongoose.model('ArticleContent', ArticleContentSchema);
  }

  createArticleContent(_articleId, _content, callback) {
    const articleContentData = {
      content: _content,
      articleId: _articleId,
    };
    this.articleContent.create(articleContentData, (err, resultContent) => {
      callback(err, resultContent);
    });
  }

  deleteArticleContent(id, callback) {
    if (id !== null) {
      this.articleContent.deleteOne({ _id: id }, (err) => {
        callback(err);
      });
    } else {
      callback();
    }
  }

  deleteArticleContentByArticleId(id, callback) {
    this.articleContent.deleteOne({ articleId: id }, (err) => {
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

  updateArticleContentByArticleId(id, _content, callback) {
    this.articleContent.updateOne({ articleId: id }, { $set: { content: _content } }, (err) => {
      callback(err);
    });
  }
}

module.exports = ArticleContent;
