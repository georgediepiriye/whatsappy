const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const userModel = mongoose.Schema(
  {
    name: { type: String, trim: true, require: true },
    username: { type: String, trim: true, unique: true, require: true },
    password: { type: String, require: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestams: true }
);

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;
