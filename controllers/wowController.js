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
    // req.body.username = "MaxAxe"     
    req.body.password = "password";    
    // req.body.passwordConf = "password";
    let user = new User(req);    
    user.authenticateUser((err)=>{
        if(err){
            next(err);
        }        
        else{
            return res.redirect('/wow')
        }
    });
};

exports.test2 = function (req, res) {
    req.body.email = "max@gmail.com";   
    // req.body.username = "MaxAxe"     
    req.body.password = "password";    
    // req.body.passwordConf = "password";
    let user = new User(req);    
    user.authenticateUser((err)=>{
        if(err){
            next(err);
        }        
        else{
            return res.redirect('/wow')
        }
    });
};