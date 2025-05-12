const router = require("express").Router()

const attendanceTimeService = require("../../services/attendanceTime")

const {authorize} = require("../../middleware/authorize")

router.post("/admin/add-setTime",authorize("admin"), attendanceTimeService.addTime)


module.exports = router