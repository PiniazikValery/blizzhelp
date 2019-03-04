const mongoose = require('mongoose');

const ArticleContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  },
});

module.exports = ArticleContentSchema;
