const  router = require("express").Router()
const userService = require("../../services/auth")
const validate = require("../../middleware/validateJoi")
const {addUserSch, loginUserSch} = require("../../middleware/validation/user.validation")

router.post("/add-user",validate(addUserSch), userService.addUser)
router.post("/login",validate(loginUserSch), userService.loginUser)
router.get("/all-user", userService.getAllUser)
router.get("/search-user", userService.searchUser)

module.exports = router