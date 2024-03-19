const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// 一般登入
const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email and password are required.' })

    const foundUser = await User.findOne({ account: email }).exec()

    if (!foundUser) return res.sendStatus(401) // Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: foundUser._id,
            username: foundUser.name,
          },
        },

        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      )

      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )

      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken
      await foundUser.save()

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // sameSite: "None",
      })

      // 正式回傳accessToken
      // 判斷是不是管理者登入
      if (foundUser.permission) {
        res.json({
          accessToken,
          photo: foundUser.photo,
          userId: foundUser._id,
          permission: foundUser.permission,
        })
        return
      }
      res.json({ accessToken, photo: foundUser.photo, userId: foundUser._id })

      // res.redirect("/welcome");
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    console.log(error)
  }
}

const handleSignUp = async (req, res) => {
  const { name, email, password, nickName, phone, address } = req.body
  if (!email || !password || !name)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })

  // 確認信箱是否被註冊過
  const duplicate = await User.findOne({ account: email }).exec()

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
      nickName: nickName,
      intro: '',
      address: address,
      phone: phone,
      historyPoints: 0,
      points: 0,
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
  if (!cookies?.accessToken) {
    return res.sendStatus(204) // No content to send back
  }

  const refreshToken = cookies.accessToken
  console.log('🚀 ~ handleLogout ~ refreshToken:', refreshToken)

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec()

  if (!foundUser) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    return res
      .sendStatus(204)
      .json({ status: 'success', message: 'Successfully logged out!' })
  }

  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log('[DELETE refreshToken]', result)

  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }) // secure:true - only serves on https

  res.sendStatus(204).json({ error: false, message: 'Successfully Logout' })
}

// google登入成功
const handleCheckLoginSuccess = async (req, res) => {
  if (req.user) {
    console.log(req.user)
    const expiryDate = new Date(Date.now() + 3600000) // 1 hour
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: req.user.id,
          username: req.user.name,
        },
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        expires: expiryDate,
      })
      .status(200)
      .json({
        error: false,
        message: 'Successfully Logged In',
        token: accessToken,
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
