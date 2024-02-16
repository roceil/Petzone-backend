const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleSignIn = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })

  const foundUser = await User.findOne({ account: email }).exec()
  console.log('🚀 ~ foundUser:', foundUser)

  if (!foundUser) return res.sendStatus(401) // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.name,
        },
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' },
    )

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    )

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log('[Auth]', result)

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: "None",
    })
    //正式 回傳accessToken
    res.json({ accessToken })

    // res.redirect("/welcome");
  } else {
    res.sendStatus(401)
  }
}

const handleSignUp = async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password || !name)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })

  // 確認信箱是否被註冊過
  const duplicate = await User.findOne({ email }).exec()

  if (duplicate) {
    console.log('信箱已經被註冊。請使用另一個信箱，或者嘗試使用此信箱登入系統')
    return res.sendStatus(409) // Conflict
  }

  try {
    // encrpty the password (hash and salt)
    const hashedPassword = await bcrypt.hash(password, 12)

    //create and store the new user
    const newUser = new User({
      name,
      googleID: '',
      photo: '',
      account: email,
      password: hashedPassword,
      nickName: '',
      intro: '',
      address: '',
      phone: '',
      historyPoints: null,
      points: null,
      pointsRecord: [],
      cart: [],
      permission: '',
    })
    await newUser.save()
    console.log('用戶註冊成功!', newUser)
    res.status(201).json({
      message: `New ${newUser.name} created!`,
      data: newUser,
      status: 'success',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const handleLogout = async (req, res, next) => {
  // On client, also delete the accessToken

  // 假如用google登入就會有這個
  if (req.user) {
    return next()
  }

  const cookies = req.cookies
  console.log('🚀 ~ handleLogout ~ cookies:', cookies)
  if (!cookies?.jwt) {
    return res.sendStatus(204) // No content to send back
  }

  const refreshToken = cookies.jwt
  console.log('🚀 ~ handleLogout ~ refreshToken:', refreshToken)

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec()

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log('[DELETE refreshToken]', result)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure:true - only serves on https

  res.sendStatus(204).json({ message: 'Successfully Loglout' })
}

const handleCheckLoginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.user,
    })
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' })
  }
}

const handleLoginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure',
  })
}

module.exports = {
  handleSignIn,
  handleSignUp,
  handleLogout,
  handleCheckLoginSuccess,
  handleLoginFailed,
}
