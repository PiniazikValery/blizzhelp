exports.get_wow = function (req, res) {
    res.render('wow/index', { title: 'Blizzhelp', dropdownFor: 'wow' });
};

exports.get_tanking_guide = function (req, res) {
    res.render('wow/general_guides/tanking_guide', { dropdownFor: 'wow' });
};