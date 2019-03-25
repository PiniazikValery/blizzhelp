const crypto = require('crypto');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../../config');

class ArticleImageStorage {
  constructor() {
    this.maxFileSize = 1024 * 1024 * 2;
    this.gfs = null;
    mongoose.connection.once('open', () => {
      this.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'articleImageUploads',
      });
    });
    this.storage = new GridFsStorage({
      url: config.get('connectionString'),
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
    this.upload = multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image')) {
          req.fileUploadError = { errorType: 'fileValidationError' };
          return cb(null, false, req.fileUploadError);
        }
        return cb(null, true);
      },
      limits: { fileSize: this.maxFileSize },
    });
  }

  getUpload() {
    return this.upload;
  }

  getDownloadStreamOfFileById(id, callback) {
    callback(this.gfs.openDownloadStream(id));
  }

  deleteFileById(id, callback) {
    if (id !== null) {
      this.gfs.delete(id, (err) => {
        callback(err);
      });
    } else {
      callback();
    }
  }
}

module.exports = ArticleImageStorage;
