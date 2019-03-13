const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const ArticleImageStorage = require('../../models/fileStorageFacilities/articleImageStorage');
const ArticleContent = require('../../models/blog/articleContent');
const config = require('../../config');

const articleImageStorage = new ArticleImageStorage();
const articleContent = new ArticleContent();

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
    ref: 'ArticleContent',
  },
});

ArticleSchema.plugin(mongoosePaginate);

const validateTopic = (topic, callback) => {
  if (config.get('avaliableTopics').includes(topic)) {
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

ArticleSchema.pre('save', function beforeSave(next) {
  articleContent.createArticleContent(this.fullContent, (err) => {
    next(err);
  });
});

ArticleSchema.pre('updateOne', function beforeUpdate(next) {
  if (this.getUpdate().$set.topic !== undefined) {
    validateTopic(this.getUpdate().$set.topic, (err) => {
      next(err);
    });
  } else {
    next();
  }
});

ArticleSchema.pre('remove', function beforeRemove(next) {
  articleImageStorage.deleteFileById(this.article_image, (err) => {
    next(err);
  });
});

ArticleSchema.pre('remove', function beforeRemove(next) {
  articleContent.deleteArticleContent(this.fullContent, (err) => {
    next(err);
  });
});

module.exports = ArticleSchema;
