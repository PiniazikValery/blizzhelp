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
    });
  }
};
