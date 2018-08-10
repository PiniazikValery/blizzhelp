var mongoose = require('mongoose');
var UserSchema = require('../schemes/user_schema')
var bcrypt = require('bcrypt');

class User {
    constructor(req) {
        this.req = req;
        this.user = mongoose.model('User', UserSchema);
    }

    createUser() {                       
        let userData = {
            email: this.req.body.email,
            username: this.req.body.username,
            password: this.req.body.password,            
            activated: false,
        }
        this.user.create(userData);
    }

    authenticateUser(callback) {
        this.user.findOne({
                email: this.req.body.email
            })
            .exec(function (err, user) {
                if (err) {
                    return callback(err)
                } else if (!user) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(this.req.body.password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                })
            });
    }
}

module.exports = User;