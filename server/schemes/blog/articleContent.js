const mongoose = require('mongoose');

const ArticleContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = ArticleContentSchema;
