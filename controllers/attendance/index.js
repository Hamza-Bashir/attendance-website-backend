const router = require("express").Router()
const attendanceService = require("../../services/attendance")

router.post("/add-attendance/:id", attendanceService.addAttendance)
router.post("/add-checkout/:user_id", attendanceService.addCheckOut)
router.get("/get-attendance", attendanceService.getAllAttendance)
router.get("/search-attendance", attendanceService.searchAttendance)

module.exports = router