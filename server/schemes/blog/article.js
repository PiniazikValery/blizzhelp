const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  article_image: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = ArticleSchema;
