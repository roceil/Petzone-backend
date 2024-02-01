const userModel = require("../models/userModel");
const User = require("../models/user-model");

async function getUserData(req, res) {
  try {
    const data = await userModel.getUsers("test");
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

const getUsersInfo = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      console.log("no user");
      return res.status(204).json({ message: "no user found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { getUserData, getUsersInfo };
