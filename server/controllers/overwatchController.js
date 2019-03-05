exports.get_overwatch = (req, res) => {
  res.render('overwatch/index', {
    title: 'Blizzhelp',
    pageNumber: 1,
    topic: 'Overwatch',
  });
};
