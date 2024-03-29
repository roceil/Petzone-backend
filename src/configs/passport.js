const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')

passport.serializeUser((user, done) => {
  console.log('Serialize使用者')
  // console.log("Serialize user detail", user);
  done(null, user._id) // 將mongoDB的id，存在session
  // 並且將id簽名後，以Cookie的形式給使用者
})

passport.deserializeUser(async (_id, done) => {
  console.log(
    'Deserialize使用者。。。使用serializeUser儲存的id，去找到資料庫內的資料'
  )
  const foundUser = await User.findOne({ _id })
  done(null, foundUser) // 將req.user這個屬性設定為foundUser
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL, // 要放後端位置
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('===Google strategy===')
      console.log('accessToken from google', accessToken)
      let foundUser = await User.findOne({
        account: profile.emails[0].value,
      }).exec()
      if (foundUser) {
        console.log('使用者已經註冊過了。無須存入資料庫內。')

        done(null, foundUser) // 會去執行serializeUser
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(generatedPassword, 12)

        console.log('使用者是第一次登入，將從google取得用戶資料並存入DB')
        const newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          photo: profile.photos[0].value,
          account: profile.emails[0].value,
          // google 登入無password 之後改成bycrpt上隨機密碼
          password: hashedPassword,
          nickName: '',
          intro: '',
          address: '',
          phone: '',
          historyPoints: 0,
          points: 0,
          pointsRecord: [],
          cart: [],
          permission: '',
        })
        const savedUser = await newUser.save()
        //

        console.log('成功創建新用戶。')
        done(null, savedUser)
      }
    }
  )
)
