const mongoose = require('mongoose');
const CommentSchema = require('../../schemes/blog/comment');

class Comment {
  constructor() {
    this.comment = mongoose.model('Comment', CommentSchema);
  }

  createComment(commentData, callback) {
    this.comment.create(commentData, (err, resultContent) => {
      callback(err, resultContent);
    });
  }

  getCommentsByArticle(articleName, callback) {
    this.comment.find({ article: articleName }, (err, comments) => {
      if (err) {
        callback(err);
      } else {
        callback(null, comments.sort(Comment.compareComments));
      }
    });
  }

  static compareComments(a, b) {
    if (a.postDate < b.postDate) {
      return -1;
    }
    if (a.postDate > b.postDate) {
      return 1;
    }
    return 0;
  }
}

module.exports = Comment;
