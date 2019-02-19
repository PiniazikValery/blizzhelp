const mongoose = require('mongoose');

const EmailCodesSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  verification_code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '300s',
    default: Date.now,
  },
});

module.exports = EmailCodesSchema;
