const  router = require("express").Router()
const userService = require("../../services/auth")

router.post("/add-user", userService.addUser)

module.exports = router