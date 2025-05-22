const router = require("express").Router()

const adminService = require("../../services/admin")
const {authorize} = require("../../middleware/authorize")

router.get("/admin/all-user", authorize("admin"), adminService.getAllUser)
router.get("/admin/search-user", authorize("admin"), adminService.searchUser)
router.delete("/admin/delete-user", authorize("admin"), adminService.deleteUser)
router.get("/admin/all-attendance", authorize("admin"), adminService.getAllattendace)
router.get("/admin/search-attendance", authorize("admin"), adminService.searchAttendanceByName)
router.post("/admin/set-lateTime", adminService.setLateTimeLimit)
router.post("/admin/add-salary/:user_id", authorize("admin"), adminService.addSalary)
router.post("/admin/generate-slip/:user_id", authorize("admin"), adminService.generateSalarySlip)
router.get("/get-salary", adminService.getSalarySlip)

module.exports = router