module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/");
    }
  },

  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/home");
    } else {
      next();
    }
  },
};
