const request = require('request');
const Q = require('q');
const config = require('../../config');
const User = require('../../models/account/user');
const EmailVerificator = require('../../models/accountVerificator/emailVerificator');

const user = new User();
const emailVerificator = new EmailVerificator();

function verifyHumanity(req) {
  const d = Q.defer();
  const recaptchaResponse = req.body['g-recaptcha-response'];
  request.post('https://www.google.com/recaptcha/api/siteverify', {
    form: {
      secret: '6Lcq7pEUAAAAAO9aDUzmps2TVBR49Cv30mWIQ45v',
      response: recaptchaResponse,
      remoteip: req.connection.remoteAddress,
    },
  }, (err, httpResponse, body) => {
    if (err) {
      d.reject(new Error(err));
    } else {
      const r = JSON.parse(body);
      if (r.success) {
        d.resolve(r.success);
      } else {
        d.reject(new Error());
      }
    }
  });
  return d.promise;
}

exports.create_user = (req, res) => {
  verifyHumanity(req)
    .then(() => {
      user.initializeUser(req);
      emailVerificator.verifyEmailCode(req.body.email, req.body.auth_code, (authError) => {
        if (authError) {
          res.status(403).json({ error: authError.message });
        } else {
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
        }
      });
    })
    .catch(() => {
      res.status(400);
      res.send({
        error: 'Please verify that you\'re a human',
      });
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
