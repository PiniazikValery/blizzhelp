exports.get_wow = (req, res) => {
  res.render('wow/index', {
    title: 'Blizzhelp',
    dropdownFor: 'wow',
    pageNumber: 1,
    topic: 'WoW',
  });
};

exports.get_tanking_guide = (req, res) => {
  res.render('wow/general_guides/tanking_guide', {
    dropdownFor: 'wow',
  });
};
