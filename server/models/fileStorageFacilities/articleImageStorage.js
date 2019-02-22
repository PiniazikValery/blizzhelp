const crypto = require('crypto');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const config = require('../../config');

mongoose.connect(config.get('connectionString'), {
  useNewUrlParser: true,
});

let gfs;

mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('articleImageUploads');
});

class ArticleImageStorage {
  constructor() {
    this.gfs = gfs;
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
}

module.exports = ArticleImageStorage;
