const router = require("express").Router()

router.use(require("../controllers/auth/index.js"))
router.use(require("../controllers/attendance/index.js"))

module.exports = router