const User = require('../models/account/user');

const user = new User();

exports.requiresLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.render('errors/unauthorized_error');
  }
};

exports.apiRequiresLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({
      user_authenticated: false,
      username: null,
      user_role: null,
    });
  }
};

exports.requiresToBeAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    user.getUserById(req.session.userId, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    }).then((foundUser) => {
      if (foundUser.user_role.toLowerCase().includes('admin')) {
        next();
      } else {
        res.render('errors/access_denied');
      }
    });
  } else {
    res.render('errors/unauthorized_error');
  }
};

exports.apiRequiresToBeAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    user.getUserById(req.session.userId, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
    }).then((foundUser) => {
      if (foundUser.user_role.toLowerCase().includes('admin')) {
        next();
      } else {
        res.status(403).json({
          user_authenticated: false,
          username: null,
          user_role: null,
        });
      }
    });
  } else {
    res.status(401).json({
      user_authenticated: false,
      username: null,
      user_role: null,
    });
  }
};
