const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const CryptoJS = require("crypto-js");
const cloudinary = require("../utils/cloudinary");

//login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  //check if user with username exits
  const userExists = await User.findOne({ username: username });
  if (!userExists) {
    throw new Error("Invalid username or password");
  }

  //decrypt password in the database for the user
  const hashedPassword = CryptoJS.AES.decrypt(
    userExists.password,
    process.env.PASS_SECRET
  );

  //compare decrypted password with entered password
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  if (originalPassword !== password) {
    res.status(400);
    throw new Error("Invalid username or password");
  }

  res.status(200).json({
    _id: userExists._id,
    name: userExists.name,
    username: userExists.username,
    pic: userExists.pic,
    token: generateToken(userExists._id),
  });
});

//register
const register = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      res.status(400);
      throw new Error("Please enter all fields");
    }

    //check if user with username exits
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      throw new Error("User with this username already exists");
    }

    var picture = null;
    var user = new User({});

    if (req.body.pic) {
      picture = await cloudinary.uploader.upload(req.file.pic);

      console.log(picture);
      user = new User({
        name: name,
        username: username,
        pic: picture.url,
        password: CryptoJS.AES.encrypt(
          password,
          process.env.PASS_SECRET
        ).toString(),
      });
    } else {
      console.log("not in pic side");
      user = new User({
        name: name,
        username: username,
        password: CryptoJS.AES.encrypt(
          password,
          process.env.PASS_SECRET
        ).toString(),
      });
    }

    const savedUser = await user.save();
    if (savedUser) {
      res.status(200).json({
        _id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        token: generateToken(savedUser._id),
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  login,
  register,
};
