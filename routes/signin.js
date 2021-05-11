const express = require("express");
const route = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

route.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(400).json({ message: "User doesnot exist" });
    else {
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (valid) {
        const token = jwt.sign({ id: user._id }, config.get("JWT_TOKEN"));
        res.json({token});
      } else res.status(401).json({ message: "Log In falied" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"message":err.message});
  }
});

module.exports = route;
