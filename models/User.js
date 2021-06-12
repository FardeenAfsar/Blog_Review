const mongoose = require("mongoose");
const User = require("./User");

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

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
