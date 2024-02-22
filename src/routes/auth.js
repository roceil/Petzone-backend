const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");

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
  // (req, res) => {
  //   const accessToken = jwt.sign(
  //     { id: req.user._id },
  //     process.env.ACCESS_TOKEN_SECRET
  //   );

  //   if (req.user) {
  //     // 在這裡設置 accessToken 的 Cookie
  //     const expiryDate = new Date(Date.now() + 3600000); // 1 hour

  //     res
  //       .cookie("accessToken1", accessToken, {
  //         httpOnly: true,
  //         expires: expiryDate,
  //       })
  //       .status(200)
  //       .json(req.user);
  //   }
  // }
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

// 新增一個中間件，處理成功登入後設置 Cookie
router.use((req, res, next) => {
  console.log("hereeeeeee");
  if (req.user) {
    // 在這裡設置 accessToken 的 Cookie
    res
      .cookie("accessToken", req.user.accessToken, {
        httpOnly: true,
        expires: 60 * 60,
      })
      .status(200)
      .json(req.user);
  }
  next();
});

module.exports = router;
