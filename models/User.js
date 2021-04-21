const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  local: {
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
  },

  google: {
    googleID: {
      type: String,
    },
    userName: {
      type: String,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
