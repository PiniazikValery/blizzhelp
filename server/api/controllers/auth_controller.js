const User = require('../../models/user');

exports.create_user = (req, res) => {
  const user = new User(req);
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
  const user = new User(req);
  user.authenticateUser((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({
        message: `User with email ${req.body.email} authenticated`,
        username: req.body.username,
      });
    }
  });
};

exports.logout_user = (req, res) => {
  const user = new User(req);
  user.logOutUser((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({
        message: `User with email ${req.body.email} loged out`,
        username: req.body.username,
      });
    }
  });
};
