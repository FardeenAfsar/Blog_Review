const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc    Landing Page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc    Home Page
// @route   GET /home
router.get("/home", ensureAuth, (req, res) => {
  res.render("home");
});

module.exports = router;
