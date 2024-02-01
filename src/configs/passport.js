const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  console.log("Serialize使用者");
  // console.log("Serialize user detail", user);
  done(null, user._id); // 將mongoDB的id，存在session
  // 並且將id簽名後，以Cookie的形式給使用者
});

passport.deserializeUser(async (_id, done) => {
  console.log(
    "Deserialize使用者。。。使用serializeUser儲存的id，去找到資料庫內的資料"
  );
  const foundUser = await User.findOne({ _id });
  done(null, foundUser); // 將req.user這個屬性設定為foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://petzone-backend.zeabur.app/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("===Google strategy===");

      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已經註冊過了。無須存入資料庫內。");

        done(null, foundUser); // 會去執行serializeUser
      } else {
        console.log("使用者是第一次登入，將從google取得用戶資料並存入DB");
        const newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          photo: profile.photos[0].value,
          account: profile.emails[0].value,
          // google 登入無password 之後改成bycrpt上隨機密碼E
          nickName: "",
          intro: "",
          address: "",
          phone: "",
          historyPoints: null,
          points: null,
          pointsRecord: [],
          cart: [],
          permission: "",
        });
        const savedUser = await newUser.save();
        console.log("成功創建新用戶。");
        done(null, savedUser);
      }
    }
  )
);
