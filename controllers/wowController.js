const User = require('../models/user');

exports.get_wow = function (req, res) {
    res.render('wow/index', {
        title: 'Blizzhelp',
        dropdownFor: 'wow'
    });
};

exports.get_tanking_guide = function (req, res) {
    res.render('wow/general_guides/tanking_guide', {
        dropdownFor: 'wow'
    });
};

exports.test = function (req, res) {       
    req.body.email = "arclonerholdon@gmail.com";
    req.body.username = "Pinval";
    req.body.password = "password";
    req.body.passwordConf = "password";
    let user = new User(req);
    user.createUser();
    res.render('wow/general_guides/tanking_guide', {
        dropdownFor: 'wow'
    });
};