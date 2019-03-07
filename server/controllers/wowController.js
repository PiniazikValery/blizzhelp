exports.get_wow = (req, res) => {
  res.redirect('/article/page=1&topic=WoW');
};

exports.get_tanking_guide = (req, res) => {
  res.render('wow/general_guides/tanking_guide', {
    dropdownFor: 'WoW',
  });
};
