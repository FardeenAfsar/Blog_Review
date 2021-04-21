const User = require("../models/User");

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

  validateAuth: async (req, res, next) => {
    const { username, password } = req.body;
    if (!req.body.confirm_password) {
      let user = await User.findOne({
        "local.userName": username,
        "local.password": password,
      });
      if (user) {
        next();
      } else {
        req.session["alert"] = "Username and password do not match";
        res.redirect("/");
      }
    } else {
      let user = await User.findOne({ "local.userName": username });
      if (!user) {
        next();
      } else {
        req.session["alert"] = "Username already exists";
        res.redirect("/");
      }
    }
  },
};
