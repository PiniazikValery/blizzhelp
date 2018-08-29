const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = require('../schemes/user_schema');
const SessionStore = require('./sessions/sessionStore');

class User {
  constructor(req) {
    this.refReq = { receivedReq: req };
    this.user = mongoose.model('User', UserSchema);
  }

  createUser(callback) {
    const userData = {
      email: this.refReq.receivedReq.body.email,
      username: this.refReq.receivedReq.body.username,
      password: this.refReq.receivedReq.body.password,
      activated: false,
    };
    this.user.create(userData, (err) => {
      callback(err);
    });
  }

  logOutUser(callback) {
    this.refReq.receivedReq.session.destroy((err) => {
      callback(err);
    });
  }

  authenticateUser(callback) {
    const localReq = { req: this.refReq.receivedReq };
    this.user.findOne({ email: localReq.req.body.email })
      .exec((err, user) => {
        if (err) {
          return callback(err);
        }
        if (!user) {
          const userNotFoundErr = new Error('User not found.');
          userNotFoundErr.status = 401;
          return callback(userNotFoundErr);
        }
        return bcrypt.compare(localReq.req.body.password, user.password, (compareErr, result) => {
          if (result === true) {
            SessionStore.createSession(user, localReq.req);
            return callback(null);
          }
          return callback(compareErr);
        });
      });
  }
}

module.exports = User;
