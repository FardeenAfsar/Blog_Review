const express = require("express");
const router = express.Router();

// @desc    Landing Page
// @route   GET /
router.get("/", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

module.exports = router;
