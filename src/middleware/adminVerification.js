const adminVerification = async (req, res, next) => {
  const admin = req.session?.user?.admin;

  if (!admin) return res.redirect('/');
  return next();
};

module.exports = adminVerification;