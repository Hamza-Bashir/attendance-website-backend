const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const attendance = require("../../model/attendanceSchema/index")



// --------- Add attendance ----------

const addAttendance = asyncErrorHandler(async (req,res)=>{
    console.log("1")
    const {id} = req.params

    const now = new Date()
    const startofDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const newAttendance = await attendance({
        user:id,
        date:startofDay,
        checkIn:now,
        checkOut:now
    })

    await newAttendance.save()

    res.status(200).json({
        message:"Attendance added successfully"
    })


})

module.exports = {addAttendance}

