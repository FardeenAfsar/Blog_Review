const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const axios = require("axios");

const { ensureAuth } = require("../middleware/auth");

// @desc    Get the review posting page
// @route   GET /review/post
router.get("/post", ensureAuth, (req, res) => {
  res.render("post_review", {
    layout: "review",
    movieId: req.query.id,
  });
});

// @desc    Post review data to database
// @route   POST /review/post
router.post("/post", ensureAuth, async (req, res) => {
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

// @desc    View review blog
// @route   GET /review/view
router.get("/view", ensureAuth, async (req, res) => {
  const data = await Review.findById(req.query.r).populate("user").lean();
  res.render("view_review", {
    data,
  });
});

module.exports = router;
