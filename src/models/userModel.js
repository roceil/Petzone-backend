// src/models/userModel.js
// const { MongoClient } = require("mongodb");
// const dotenv = require("dotenv");
// dotenv.config({ path: ".env.local" });

// const url = process.env.MONGODB_URI;

// let db;

// async function connectToMongoDB() {
//   const client = new MongoClient(url);
//   console.log("資料庫連接中...");
//   try {
//     await client.connect();
//     console.log("成功連接到 MongoDB");
//     db = client.db("mongo");
//     // 處理後續邏輯，例如設置模型等
//   } catch (error) {
//     console.error("連接到 MongoDB 失敗:", error);
//     // 根據您應用的需要，您可以在這裡進行重試邏輯，或者直接終止程序
//     process.exit(1);
//   }
// }

// function getUsers(collection) {
//   console.log(collection);
//   return db.collection(collection).find({}).toArray();
// }

// module.exports = { connectToMongoDB, getUsers };
