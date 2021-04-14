const express = require("express");
const router = express.Router();

// @desc    Landing Page
// @route   GET /
router.get("/", (req, res) => {
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
