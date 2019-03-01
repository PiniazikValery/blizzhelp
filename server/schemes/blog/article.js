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
  if (topics.includes(topic)) {
    callback();
  } else {
    callback(new Error('Wrong topic name'));
  }
};

ArticleSchema.pre('save', function beforeSave(next) {
  validateTopic(this.topic, (err) => {
    if (err) {
      next(new Error('Wrong topic name'));
    } else {
      next();
    }
  });
});

ArticleSchema.pre('updateOne', function beforeUpdate(next) {
  validateTopic(this.getUpdate().topic, (err) => {
    if (err) {
      next(new Error('Wrong topic name'));
    } else {
      next();
    }
  });
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
