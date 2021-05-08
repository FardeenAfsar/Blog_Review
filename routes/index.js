const express = require("express");
const router = express.Router();
const passport = require("passport");
const Review = require("../models/Review");

const axios = require("axios");

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
  res.render("post_review", {
    layout: "post_review",
    movieId: req.query.id,
  });
});

// @desc    Post review Page
// @route   GET /post
router.post("/review", ensureAuth, async (req, res) => {
  req.body.user = req.user.id;
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${req.query.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    )
    .then((response) => {
      req.body.movie = {
        id: req.query.id,
        title: response.data.original_title,
        image: response.data.poster_path,
      };
      Review.create(req.body);
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/home");
    });
});

// @desc    Post review Page
// @route   GET /post
router.post("/movie", ensureAuth, (req, res) => {
  res.redirect(`/movie?movie=${req.body.search}&page=1`);
});

// @desc    Post review Page
// @route   GET /post
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

module.exports = router;
