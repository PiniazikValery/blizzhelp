exports.get_articles = (req, res) => {
  res.render('article/index', {
    title: `${req.params.topic} articles`,
    dropdownFor: req.params.topic,
    pageNumber: req.params.page,
    topic: req.params.topic,
  });
};

exports.get_create_article = (req, res) => {
  res.render('article/manageArticle/createArticle', {
    title: 'Create article',
  });
};

exports.get_show_article = (req, res) => {
  res.render('article/manageArticle/showArticle');
};
