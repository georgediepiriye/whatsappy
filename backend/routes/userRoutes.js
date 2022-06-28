const router = require("express").Router();
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const CryptoJS = require("crypto-js");
const cloudinary = require("../utils/cloudinary");

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //check if all fields are inputed
    if (!username || !password) {
      res.status(400).json({ error: "Please enter all fields!" });
      return;
    }

    //check if user with username exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: "Wrong Credentials" });
      return;
    }

    //get user's decrypted password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    //compare user's decrypted password with inputed password
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      res.status(401).json({ error: "Wrong Credentials" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
  }
});

//register
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      res.status(400).json({ error: "Please enter all fields!" });
      return;
    }

    //check if user with username exits
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      res.status(400).json({ error: "User with this username already exists" });
      return;
    }

    var user = new User({});

    if (req.body.image != null) {
      const result = await cloudinary.uploader.upload(req.body.image);

      user = new User({
        name: name,
        username: username,
        pic: result.url,
        password: CryptoJS.AES.encrypt(
          password,
          process.env.PASS_SECRET
        ).toString(),
      });
    } else {
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
      res.status(400).json({ error: "Something went wrong!" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
