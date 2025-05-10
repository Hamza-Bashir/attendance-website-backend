const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const attendance = require("../../model/attendanceSchema/index")
const User = require("../../model/userSchema/index")



// --------- Add attendance ----------

const addAttendance = asyncErrorHandler(async (req,res)=>{
    
    const {user_id} = req.params

    const existingUser = await User.findOne({_id:user_id})

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    const now = new Date()

    
    const startofDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
 
    const allowedCheckInTime = new Date(startofDay)

    allowedCheckInTime.setHours(9)
    allowedCheckInTime.setMinutes(0)
    allowedCheckInTime.setSeconds(0)
    allowedCheckInTime.setMilliseconds(0)

    const lateTime = existingUser.lateTimeLimit || 10
    const allowedLatestTime = new Date(allowedCheckInTime.getTime() + lateTime * 60000)

    const isLate = now > allowedLatestTime

    const existAttendance = await attendance.findOne({
        date:startofDay
    })

    if(existAttendance){

        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode:STATUS_CODES.CONFLICT,
            message:"Already present"
        })
    }

    await attendance.create({
        user:user_id,
        date:startofDay,
        checkIn:now,
        isLate:isLate
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:"CheckIn successfully Login"
    })



})


// --------- Add checkOutTime ----------

const addCheckOut = asyncErrorHandler(async (req,res)=>{
    const {user_id} = req.params
    const {attendance_id} = req.body

    const now = new Date()

    if(!user_id){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.ID_REQUIRED
        })
    }

    await attendance.findByIdAndUpdate(attendance_id, {
        checkOut:now
    },{new:true})

    res.status(200).json({
        message:"Checkout add successfully"
    })
})


// --------- Get all attendance ----------

const getAllAttendance = asyncErrorHandler(async (req,res)=>{
    const currentdate = new Date()
    currentdate.setHours(0,0,0,0)

    const previousAttendance = await attendance.find(
        {
            date:{$lt:currentdate}
        }
    ).populate("user")

    if(previousAttendance.length === 0){
        return res.status(400).json({
            message:"Not record found"
        })
    }

    res.status(200).json({
        previousAttendance
    })
})

// --------- Search attendance ----------

const searchAttendance = asyncErrorHandler(async (req,res)=>{
    
    const {date} = req.query
    
    const searchDate = new Date(date)

    const startofDay = new Date(searchDate.setHours(0,0,0,0))
    const endofDay = new Date(searchDate.setHours(23,59,59,999))

    const existingAttendance = await attendance.findOne({
        date:{$gte:startofDay, $lte:endofDay}
    }).populate("user")

    if(!existingAttendance){
        return res.status(400).json({
            message:"Record not found"
        })
    }

    res.status(200).json({
        existingAttendance
    })
})






module.exports = {addAttendance, addCheckOut, getAllAttendance, searchAttendance}

