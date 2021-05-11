const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

route.post("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).json({ message: "Not token provided" });
  try {
    const decode = await jwt.verify(token, config.get("JWT_TOKEN"));
    if (decode) {
      const user = await User.findOne({ _id: decode.id });
      if (user) res.json(user);
      else return res.status(401).json({ message: "User not found" });
    } else return res.status(400).json({ message: "FAILED" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = route;
