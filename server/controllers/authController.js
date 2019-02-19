exports.get_registration_page = (req, res) => {
  res.render('auth/registration', { title: 'Blizzhelp' });
};
