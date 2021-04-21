const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateSignup, validateLogin } = require("../middleware/auth");

// @desc    Google auth
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// @desc    Logout User
// @route   GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// @desc    Process signup form
// @route   POST /auth/signup
router.post(
  "/signup",
  validateSignup,
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// @desc    Process login form
// @route   POST /auth/login
router.post(
  "/login",
  validateLogin,
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

module.exports = router;
