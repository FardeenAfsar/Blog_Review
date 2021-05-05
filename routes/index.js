const express = require("express");
const router = express.Router();
const passport = require("passport");
const Review = require("../models/Review");

const { ensureAuth, ensureGuest, validateAuth } = require("../middleware/auth");

// @desc    Landing Page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  if (req.session.alert) {
    res.render("login", {
      layout: "login",
      alert: req.session.alert,
    });
  } else {
    res.render("login", {
      layout: "login",
    });
  }

  req.session.alert = null;
});

// @desc    Home Page
// @route   GET /home
router.get("/home", ensureAuth, async (req, res) => {
  const reviews = await Review.find()
    .sort({ _id: -1 })
    .limit(10)
    .populate("user")
    .lean();
  res.render("home", {
    reviews,
  });
});

// @desc    Process login and signup form
// @route   POST /
router.post(
  "/",
  validateAuth,
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// @desc    Post review Page
// @route   GET /post
router.get("/post", ensureAuth, (req, res) => {
  res.render("add");
});

// @desc    Post review Page
// @route   GET /post
router.post("/review", ensureAuth, async (req, res) => {
  req.body.user = req.user.id;
  await Review.create(req.body);
  res.redirect("/home");
});

module.exports = router;
