const mongoose = require('mongoose');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');
const ArticleContent = require('../../models/blog/articleContent');

const articleImageStorage = new ArticleImageStorage();
const articleContent = new ArticleContent();
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
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
  preViewContent: {
    type: String,
    required: true,
  },
  fullContent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

const validateTopic = (topic, callback) => {
  if (topics.includes(topic) || topic === undefined) {
    callback();
  } else {
    callback(new Error('Wrong topic name'));
  }
};

ArticleSchema.pre('save', function beforeSave(next) {
  validateTopic(this.topic, (err) => {
    next(err);
  });
});

ArticleSchema.pre('updateOne', function beforeUpdate(next) {
  validateTopic(this.getUpdate().topic, (err) => {
    next(err);
  });
});

ArticleSchema.pre('remove', function beforeRemove(next) {
  articleImageStorage.deleteFileById(this.article_image, (err) => {
    if (err) {
      next(err);
    } else {
      articleContent.deleteArticleContent(this.fullContent, (deleteContentErr) => {
        next(deleteContentErr);
      });
    }
  });
});

module.exports = ArticleSchema;
