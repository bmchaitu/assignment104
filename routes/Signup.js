const express = require("express");
const route = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

route.post("/", async (req, res) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(req.body.password, saltRounds);
    const obj = {
      username: req.body.username,
      password: hashed,
    };
    var user = await User.findOne({ username: req.body.username });
    if (user) res.status(400).json({ message: "User already exists" });
    else {
      user = new User(obj);
      const token = jwt.sign({ id: user._id }, config.get("JWT_TOKEN"));
      await user.save();
      res.json({token, username:user.username});
    }
  } catch (err) {
    res.status(500).json({"message":err.response.data.message});
  }
});

module.exports = route;
