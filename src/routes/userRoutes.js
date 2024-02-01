// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUserData);

// 我暫時用我online mongodb data
router.get("/usersInfo", userController.getUsersInfo);

module.exports = router;
