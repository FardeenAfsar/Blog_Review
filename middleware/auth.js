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

  validateSignup: async (req, res, next) => {
    const { username } = req.body;
    let user = await User.findOne({ "local.userName": username });

    if (!user) {
      next();
    } else {
      const alert = "Username already exists";
      res.render("login", {
        layout: "login",
        alert,
      });
    }
  },

  validateLogin: async (req, res, next) => {
    const { username, password } = req.body;
    let user = await User.findOne({
      "local.userName": username,
      "local.password": password,
    });

    if (user) {
      next();
    } else {
      const alert = "Username and password do not match";
      res.render("login", {
        layout: "login",
        alert,
      });
    }
  },
};
