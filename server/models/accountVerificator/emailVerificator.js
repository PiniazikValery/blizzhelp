const mongoose = require('mongoose');
const randomCodeGenerator = require('randomstring');
const nodemailer = require('nodemailer');
const EmailCodesSchema = require('../../schemes/accountVerificator/emailCodes_schema');

class EmailVerificator {
  constructor() {
    this.emailCode = mongoose.model('EmailCode', EmailCodesSchema);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Blizzhelper@gmail.com',
        pass: 'Dfkthfgbyzpbr1',
      },
    });
    this.mailOptions = {
      from: 'Blizzhelper@gmail.com',
      to: '',
      subject: 'Verification for blizzhelp',
      text: '',
    };
  }

  createEmailCode(_email, callback) {
    const emailCodeData = {
      email: _email,
      verification_code: randomCodeGenerator.generate(10),
    };
    this.emailCode.create(emailCodeData, (err) => {
      if (err) {
        callback(err);
      } else {
        this.mailOptions.to = _email;
        this.mailOptions.text = `Your verification code: ${emailCodeData.verification_code}`;
        this.transporter.sendMail(this.mailOptions, (mailError) => {
          if (mailError) {
            callback(mailError);
          } else {
            callback();
          }
        });
      }
    });
  }

  verifyEmailCode(_email, _code, callback) {
    this.emailCode.findOne({ email: _email, verification_code: _code })
      .exec((err, emailCode) => {
        if (err) {
          return callback(err);
        }
        if (!emailCode) {
          const codeHasNotGeneratedErr = new Error('Wrong code or email');
          codeHasNotGeneratedErr.status = 401;
          return callback(codeHasNotGeneratedErr);
        }
        return callback();
      });
  }
}

module.exports = EmailVerificator;
