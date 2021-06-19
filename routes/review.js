const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const axios = require("axios");
const mongoose = require("mongoose");

const { ensureAuth, ensureUser } = require("../middleware/auth");

// @desc    Get the review posting page
// @route   GET /review/post
router.get("/post", ensureAuth, (req, res) => {
  try {
    res.render("post_review", {
      layout: "review",
      movieId: req.query.id,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc    Post review data to database
// @route   POST /review/post
router.post("/post", ensureAuth, async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc    View review blog
// @route   GET /review/view
router.get("/view", ensureAuth, async (req, res) => {
  try {
    const data = await Review.findById(req.query.r)
      .populate("user")
      .populate("comments.user")
      .lean();
    let comments = data.comments;
    if (data.comments) {
      comments = data.comments.reverse();
    }
    res.render("view_review", {
      data,
      comments,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc    Edit review blog
// @route   GET /review/edit
router.get("/edit", ensureAuth, ensureUser, async (req, res) => {
  try {
    const content = await Review.findById(req.query.r);
    res.render("edit_review", {
      layout: "review",
      content: content.body,
      reviewId: req.query.r,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc    Update review blog
// @route   PUT /review/edit
router.put("/edit", ensureAuth, async (req, res) => {
  try {
    await Review.findOneAndUpdate({ _id: req.query.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc    Delete review blog
// @route   DELETE /review/delete
router.delete("/delete", ensureAuth, async (req, res) => {
  try {
    await Review.remove({ _id: req.query.r });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc    Post comment
// @route   PUT /review/comment
router.put("/comment", ensureAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.query.r);
    const userId = mongoose.Types.ObjectId(res.locals.userId);
    const comment = { user: userId, comment: req.body.comment };
    await Review.updateOne({ _id: id }, { $push: { comments: comment } });
    res.redirect("back");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc    Delete comment
// @route   PUT /comment/delete
router.put("/comment/delete", ensureAuth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.query.id);
    await Review.updateOne(
      { _id: req.query.r },
      { $pull: { comments: { _id: id } } }
    );
    res.redirect("back");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

module.exports = router;
