const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");
const authController = require("../controllers/authController");

// 一般登入
router.post("/signin", authController.handleSignIn);

// google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.user);
    const user = req.user;

    console.log("Successful authentication, redirect to homepage.");
    // return res.send({ user });
    return res.redirect("/welcome");
  }
);

// google 註冊 或 一般註冊
router.post("/signup", authController.handleSignUp);

// router.get("/logout", authController.handleLogout);
router.get("/logout", authController.handleLogout, (req, res) => {
  req.logOut((err) => {
    console.log("You logged out");
    if (err) return res.send(err);
    return res.redirect("/");
  });
});

//////////////////////////////////

module.exports = router;
