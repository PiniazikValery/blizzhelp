exports.get_articles = (req, res) => {
  res.render('article/index', {
    title: `${req.params.topic} articles`,
    dropdownFor: req.params.topic,
    pageNumber: req.params.page,
    topic: req.params.topic,
  });
};
