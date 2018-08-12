var mongoose = require('mongoose');
var UserSchema = require('../schemes/user_schema')
var bcrypt = require('bcrypt');
var SessionStore = require('./sessions/sessionStore');

class User {
    constructor(req) {
        this.refReq = { req: req }
        this.user = mongoose.model('User', UserSchema);
    }

    createUser(callback) {
        let userData = {
            email: this.refReq.req.body.email,
            username: this.refReq.req.body.username,
            password: this.refReq.req.body.password,
            activated: false,
        }
        this.user.create(userData,(err)=>{
            callback(err);
        });
    }

    logOutUser(callback) {
        this.refReq.req.session.destroy((err)=>{
            callback(err);
        });
    }

    authenticateUser(callback) {
        let localReq = { req: this.refReq.req };
        this.user.findOne({ email: localReq.req.body.email })
            .exec(function (err, user) {
                if (err) {
                    return callback(err)
                } else if (!user) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(localReq.req.body.password, user.password, function (err, result) {
                    if (result === true) {
                        SessionStore.createSession(user, localReq.req);                        
                        callback(null);
                    } else {
                        return callback(err);
                    }
                })
            });
    }
}

module.exports = User;