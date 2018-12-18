const config = require('../../config');
const User = require('../../models/account/user');

const user = new User();

exports.create_user = (req, res) => {
  user.initializeUser(req);
  user.createUser((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: `User ${req.body.username} created`,
        username: req.body.username,
        email: req.body.email,
      });
    }
  });
};

exports.auth_user = (req, res) => {
  user.initializeUser(req);
  user.authenticateUser((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      user.getUserByEmail(req.body.email, (foundUser) => {
        res.status(200).json({
          message: `User with email ${req.body.email} authenticated`,
          username: foundUser.username,
          expiration_time: config.get('ttl_days') * 24 * 60 * 60 * 1000,
        });
      });
    }
  });
};

exports.logout_user = (req, res) => {
  if (req.session && req.session.userId) {
    const cashedUserId = req.session.userId;
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        user.getUserById(cashedUserId, (errMessage) => {
          if (errMessage) {
            res.status(500).json({ error: errMessage.message });
          }
        }).then((foundUser) => {
          res.status(200).json({
            message: `User with email ${foundUser.email} loged out`,
            username: req.body.username,
          });
        });
      }
    });
  } else {
    res.status(401).json({
      message: 'You need to log in first',
    });
  }
};

exports.is_user_authenticated = (req, res) => {
  if (req.session && req.session.userId) {
    user.getUserById(req.session.userId, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    }).then((foundUser) => {
      res.status(200).json({
        user_authenticated: true,
        username: foundUser.username,
      });
    });
  } else {
    res.status(200).json({
      user_authenticated: false,
      username: null,
    });
  }
};
