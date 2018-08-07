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
            passwordConf: this.req.body.passwordConf,
            activated: false,
        }
        this.user.create(userData);
    }

    authenticate(res, redirect, callback) {
        this.user.findOne({
                email: this.req.body.logemail
            })
            .exec((err, user) => {
                if (err) {
                    return callback(err);
                } else if (!user) {
                    let err = new Error('User not found.');
                    err.status = 401;
                    return callback(err)
                }
                bcrypt.compare(this.req.body.logpassword, user.password, (err,result)=>{
                    if(result === true){
                        
                    }
                })
            })
    }
}

module.exports = new User();