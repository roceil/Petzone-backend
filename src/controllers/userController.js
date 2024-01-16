const userModel = require('../models/userModel')

async function getUserData(req, res) {
  try {
    const data = await userModel.getUsers('test')
    res.json(data)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = { getUserData }
