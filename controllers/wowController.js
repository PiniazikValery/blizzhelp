exports.get_wow = function(req, res) {
    res.render('wow/index',{title:'Blizzhelp',dropdownFor:'wow'});
};