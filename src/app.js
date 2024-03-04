require('dotenv').config()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./configs/corsOptions')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./configs/dbConn')

require('./configs/passport')
const session = require('express-session')
const passport = require('passport')

// const userModel = require("./models/userModel");
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')

connectDB()

const app = express()
const port = process.env.PORT || 3030

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials)

app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// passport js
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
)
app.use(passport.initialize())
app.use(passport.session())

// serve static files
app.use(express.static(path.join(__dirname, '/public')))

// routes
// 測試用html
app.use('/', require('./routes/rootRoute'))

app.use('/api', userRoutes)
app.use('/api', postRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', cartRoutes)
app.use('/auth', require('./routes/auth'))

// app.listen(port, () => {
//   console.log(`listening at http://localhost:${port}`);
//   userModel.connectToMongoDB();
// });

mongoose.connection.once('open', () => {
  console.log('Connected to 線上版 mongoDB')
  app.listen(port, () =>
    console.log(`Server running on port ${port} http://localhost:${port}`)
  )
})
