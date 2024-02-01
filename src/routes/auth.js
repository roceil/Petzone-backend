const express = require("express");
const router = express.Router();
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
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: process.env.CLIENT_URL,
  })
);

//一般註冊
router.post("/signup", authController.handleSignUp);

// logout (adjust in future)
router.get("/logout", authController.handleLogout, (req, res) => {
  req.logOut((err) => {
    console.log("You logged out");
    if (err) return res.send(err);
    return res.redirect(process.env.CLIENT_URL);
  });
});

// check isUser login (adjust in future)
router.get("/login/success", authController.handleCheckLoginSuccess);

// handle login failed
router.get("/login/failed", authController.handleLoginFailed);

module.exports = router;
