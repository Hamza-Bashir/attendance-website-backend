const router = require("express").Router()

const attendanceTimeService = require("../../services/attendanceTime")

const {authorize} = require("../../middleware/authorize")

router.post("/admin/add-setTime",authorize("admin"), attendanceTimeService.addTime)
router.get("/get-time", attendanceTimeService.getTime)


module.exports = router