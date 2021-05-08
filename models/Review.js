const mongoose = require("mongoose");
const User = require("./User");

const ReviewSchema = new mongoose.Schema({
  coverDesc: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  movie: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
