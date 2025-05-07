const router = require("express").Router()
const attendanceService = require("../../services/attendance")

router.post("/add-attendance/:id", attendanceService.addAttendance)

module.exports = router