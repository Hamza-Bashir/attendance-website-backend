const router = require("express").Router()

router.use(require("../controllers/auth/index.js"))
router.use(require("../controllers/attendance/index.js"))
router.use(require("../controllers/admin/index.js"))
router.use(require("../controllers/attendanceTime/index.js"))

module.exports = router