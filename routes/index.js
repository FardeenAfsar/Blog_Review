const express = require("express");
const router = express.Router();
const passport = require("passport");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

const axios = require("axios");

const { ensureAuth, ensureGuest, validateAuth } = require("../middleware/auth");

// @desc    Landing auth Page
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
    isHome: true,
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

// @desc    Post movie queries and data
// @route   POST /movie
router.post("/movie", ensureAuth, (req, res) => {
  res.redirect(`/movie?movie=${req.body.search}&page=1`);
});

// @desc    Get movie queries and display page
// @route   GET /movie
router.get("/movie", ensureAuth, (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${req.query.movie}&page=${req.query.page}&include_adult=false`
    )
    .then((response) => {
      const data = response.data.results.sort((a, b) => {
        return b.popularity - a.popularity;
      });
      res.render("movie", {
        data,
        movie: req.query.movie,
        page: req.query.page,
        totalPages: response.data.total_pages,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/home");
    });
});

// @desc    Get user profile
// @route   GET /user
router.get("/user", ensureAuth, async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.u);
  const reviews = await Review.find({ user: req.query.u })
    .populate("user")
    .sort({ _id: -1 })
    .lean();
  const userProfile = await User.findOne({ _id: req.query.u }).lean();
  const isFollowing = await User.findOne({
    _id: res.locals.userId,
    following: id,
  }).lean();
  const followersCount = await User.find({ following: id }).lean();
  const isProfile = req.query.u == res.locals.userId;
  res.render("profile", {
    reviews,
    userProfile,
    isFollowing,
    followersCount: followersCount.length,
    isProfile,
  });
});

// @desc    Put user following request
// @route   PUT /user/follow
router.put("/user/follow", ensureAuth, async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.id);
  const isFollowing = await User.findOne({
    _id: res.locals.userId,
    following: id,
  });
  if (isFollowing) {
    await User.updateOne(
      { _id: res.locals.userId },
      { $pull: { following: id } }
    );
  } else {
    await User.updateOne(
      { _id: res.locals.userId },
      { $push: { following: id } }
    );
  }
  res.redirect("back");
});

// @desc    Favorites Page
// @route   GET /favorites
router.get("/favorites", ensureAuth, async (req, res) => {
  const currentUser = await User.findOne({ _id: res.locals.userId }).lean();
  const favoriteUsers = currentUser.following;

  const reviews = await Review.find({ user: { $in: favoriteUsers } })
    .sort({ _id: -1 })
    .limit(25)
    .populate("user")
    .lean();
  res.render("favorites", {
    reviews,
    isFavorites: true,
  });
});

module.exports = router;
