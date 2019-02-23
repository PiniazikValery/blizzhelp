const crypto = require('crypto');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const config = require('../../config');

class ArticleImageStorage {
  constructor() {
    this.gfs = null;
    mongoose.connect(config.get('connectionString'), {
      useNewUrlParser: true,
    });
    mongoose.connection.once('open', () => {
      this.gfs = Grid(mongoose.connection.db, mongoose.mongo);
      this.gfs.collection('articleImageUploads');
    });
    this.storage = new GridFsStorage({
      url: config.get('connectionString'),
      useNewUrlParser: true,
      file: (req, file) => new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const _filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: _filename,
            bucketName: 'articleImageUploads',
          };
          return resolve(fileInfo);
        });
      }),
    });
    this.upload = multer({ storage: this.storage });
  }

  getUpload() {
    return this.upload;
  }

  deleteFileById(id) {
    this.gfs.deleteOne({ _id: id, root: 'articleImageUploads' });
  }
}

module.exports = ArticleImageStorage;
