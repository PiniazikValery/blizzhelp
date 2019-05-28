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

  deleteCommentById(commentId, callback) {
    const methodError = new Error();
    this.comment.find({ _id: commentId }, (foundErr, comments) => {
      switch (true) {
        case foundErr:
          callback(foundErr);
          break;
        case !comments.length:
          methodError.message = 'Can not find comment';
          methodError.code = 404;
          callback(methodError);
          break;
        default:
          this.comment.findByIdAndDelete(commentId, (err) => {
            callback(err);
          });
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
