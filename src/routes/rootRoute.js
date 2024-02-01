const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/auth/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "signin.html"));
});

router.get("/auth/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
});

const authCheck = (req, res, next) => {
  console.log(req.cookies);
  if (req.isAuthenticated() || req.cookies.jwt) {
    next();
  } else {
    return res.redirect("/auth/signin");
  }
};

router.get("/welcome", authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "welcome.html"));
});

module.exports = router;
