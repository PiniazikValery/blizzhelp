import multer from 'multer';
import _cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

_cloudinary.config({
  cloud_name: 'dxxayfytg',
  api_key: '176327553737376',
  api_secret: 'kUAchSixjC6cWt2ylim_Amtbcy4',
});

class CloudinaryImageStorage {
  constructor() {
    this.storage = cloudinaryStorage({
      cloudinary: _cloudinary,
      folder: 'demo',
      allowedFormats: ['jpg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });
    this.parser = multer({ storage: this.storage });
  }

  getParser() {
    return this.parser;
  }
}

module.exports = CloudinaryImageStorage;
