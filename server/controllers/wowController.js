exports.get_wow = (req, res) => {
  res.render('wow/index', {
    title: 'Blizzhelp',
    dropdownFor: 'wow',
  });
};

exports.get_tanking_guide = (req, res) => {
  res.render('wow/general_guides/tanking_guide', {
    dropdownFor: 'wow',
  });
};
