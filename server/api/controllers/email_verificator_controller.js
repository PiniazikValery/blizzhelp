const EmailVerificator = require('../../models/accountVerificator/emailVerificator');

const emailVerificator = new EmailVerificator();

exports.createEmailCode = (req, res) => {
  emailVerificator.createEmailCode(req.body.email, (err) => {
    if (err) {
      if (err.code === 11000) {
        res.status(501).json({ error: 'Verification code already generated for this email, please wait 1 hour to get new' });
      } else {
        res.status(501).json({ error: err.message });
      }
    } else {
      res.status(201).json({
        message: `Verification code for ${req.body.email} has been successfully created and shiped`,
      });
    }
  });
};
