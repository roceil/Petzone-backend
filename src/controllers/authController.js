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

      res
        .status(200)
        .json({ accessToken, photo: foundUser.photo, userId: foundUser._id })

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

// google登入確認是否有connect_sid
const handleCheckLogin = async (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  if (cookies['connect.sid']) {
    handleCheckLoginSuccess(req, res)
  } else {
    return res
      .status(200)
      .header({ 'Access-Control-Allow-Origin': req.headers.origin })
      .json({ message: 'Not Use Google Logged In' })
  }
}

// 認證google登入成功回傳資料
const handleCheckLoginSuccess = async (req, res) => {
  console.log(req.cookies['userId'])
  const userId = req.cookies['userId']
  if (userId) {
    const foundUser = await User.findOne({ _id: userId }).exec()
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: "None",
    })

    res
      .status(200)
      .header({ 'Access-Control-Allow-Origin': req.headers.origin })
      .json({ accessToken, photo: foundUser.photo, userId: foundUser._id })
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

// google登出
const handleLogout = async (req, res) => {
  // delete the connect_sid and accessToken
  const cookies = req.cookies
  console.log('🚀 ~ handleLogout ~ cookies:', cookies)
  if (cookies['connect.sid']) {
    // const refreshToken = cookies.accessToken
    // console.log('🚀 ~ handleLogout ~ refreshToken:', refreshToken)

    // Is refreshToken in db?
    // const foundUser = await User.findOne({ refreshToken }).exec()

    // Delete refreshToken in db
    // foundUser.refreshToken = ''
    // const result = await foundUser.save()
    // console.log('[DELETE refreshToken]', result)

    res.clearCookie('connect.sid', { httpOnly: true })
    res.clearCookie('accessToken', { httpOnly: true })
    res.clearCookie('userId', { httpOnly: true })
    res
      .status(200)
      .header({ 'Access-Control-Allow-Origin': req.headers.origin })
      .json({ message: 'Not Use Google Logged In' })
  } else {
    return res
      .status(200)
      .header({ 'Access-Control-Allow-Origin': req.headers.origin })
      .json({ message: 'Not Use Google Logged In' })
  }
}
module.exports = {
  handleSignIn,
  handleSignUp,
  handleCheckLogin,
  handleCheckLoginSuccess,
  handleLoginFailed,
  handleLogout,
}
