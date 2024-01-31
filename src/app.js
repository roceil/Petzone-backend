const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const path = require("path");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./configs/dbConn");

require("./configs/passport");
const session = require("express-session");
const passport = require("passport");

const userModel = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");

// Connect to Zeabur MongoDB through mongoose
connectDB();

const app = express();
const port = process.env.PORT || 3030;
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json());

// passport js
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/api", userRoutes);
app.use("/auth", require("./routes/auth"));

app.use("/", require("./routes/rootRoute"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
  userModel.connectToMongoDB();
});

mongoose.connection.once("open", () => {
  console.log("Connected to 線上版 mongoDB");
});
