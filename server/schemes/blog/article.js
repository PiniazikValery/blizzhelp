const mongoose = require('mongoose');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');

const articleImageStorage = new ArticleImageStorage();

const topics = ['WoW', 'Overwatch', 'Hearthstone'];

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
  topic: {
    type: String,
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

ArticleSchema.pre('save', function beforeSave(next) {
  if (topics.includes(this.topic)) {
    next();
  } else {
    next(new Error('Wrong topic name'));
  }
});

ArticleSchema.pre('remove', function beforeRemove(next) {
  articleImageStorage.deleteFileById(this.article_image, (err) => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
});

module.exports = ArticleSchema;
