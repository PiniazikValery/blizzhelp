const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  article: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = CommentSchema;
