const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const axios = require("axios");
const mongoose = require("mongoose");

const { ensureAuth, ensureUser } = require("../middleware/auth");

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

  // Regex to remove newline tags
  req.body.body = req.body.body.replace(/\r?\n|\r/g, " ");
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

// @desc    Edit review blog
// @route   GET /review/edit
router.get("/edit", ensureAuth, ensureUser, async (req, res) => {
  const content = await Review.findById(req.query.r);
  res.render("edit_review", {
    layout: "review",
    content: content.body,
    reviewId: req.query.r,
  });
});

// @desc    Update review blog
// @route   PUT /review/edit
router.put("/edit", ensureAuth, async (req, res) => {
  await Review.findOneAndUpdate({ _id: req.query.id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.redirect("/home");
});

// @desc    Delete review blog
// @route   DELETE /review/delete
router.delete("/delete", ensureAuth, async (req, res) => {
  await Review.remove({ _id: req.query.r });
  res.redirect("/home");
});

// @desc    PUt comment
// @route   PUT /review/comment
router.put("/comment", ensureAuth, async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.r);
  const userId = mongoose.Types.ObjectId(res.locals.userId);
  const comment = { user: userId, comment: req.body.comment };
  await Review.updateOne({ _id: id }, { $push: { comments: comment } });
  res.redirect("back");
});

module.exports = router;
