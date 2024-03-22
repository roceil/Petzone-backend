const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../controllers/authController')

// 一般註冊
router.post('/signup', authController.handleSignUp)

// 一般登入
router.post('/signin', authController.handleSignIn)

// google 登入
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
)

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
  }),
  function (req, res) {
    console.log(req)
    res.cookie('userId', req.user.id, { httpOnly: true })
    res.redirect(process.env.CLIENT_URL)
  }
)

// handle google login and return user info
router.get('/login/success', authController.handleCheckLogin)

// handle google login failed
router.get('/login/failed', authController.handleLoginFailed)

// handle google logout
router.get('/logout', authController.handleLogout)

module.exports = router
