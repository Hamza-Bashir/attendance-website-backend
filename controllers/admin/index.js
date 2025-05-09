const router = require("express").Router()

const adminService = require("../../services/admin")
const {authorize} = require("../../middleware/authorize")

router.get("/admin/all-user", authorize("admin"), adminService.getAllUser)

module.exports = router