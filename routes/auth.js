const express = require("express");
const router = express.Router();

// @desc
// @route   GET /
router.get("/google", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc    Home Page
// @route   GET /home
router.get("/home", (req, res) => {
  res.render("home");
});

module.exports = router;
