const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const attendance = require("../../model/attendanceSchema/index")
const User = require("../../model/userSchema/index")
const lateTimeCount = require("../../model/lateTimeSchema/index")
const overTimeCount = require("../../model/overTimeSchema/index")
const axios = require("axios")



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
    const response = await axios.get("http://localhost:3001/get-time")
    const fixTime = response.data.time

    const fixCheckInTime = fixTime[0].fixCheckIn

    const getDate = now.toISOString().split("T")[0]

    const fixCheckInFullDate = new Date(`${getDate} ${fixCheckInTime}`)

    const different = now - fixCheckInFullDate

    const diffInMinutes = Math.floor(different / (1000*60))
    const totalHour = (diffInMinutes / 60).toFixed(1)

    const isLate = Math.floor((now-fixCheckInFullDate) / (1000 * 60)) > 0

    const existingRecord = await lateTimeCount.findOne({user:user_id})

    if(existingRecord){
        const updateDiffInMinutes = existingRecord.lateCountMinute + diffInMinutes

        const updateTotalHour = existingRecord.lateCountHours + totalHour

        await lateTimeCount.updateOne(
            {user:user_id},
            {$set:{lateCountMinute:updateDiffInMinutes, lateCountHours:updateTotalHour}}
        )
    }else{
        await lateTimeCount.create({
            user:user_id,
            lateCountMinute:diffInMinutes,
            lateCountHours:totalHour
        })
    }

    

    await attendance.create({
        user:user_id,
        date:getDate,
        checkIn:now,
        isLate
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS
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

    const response = await axios.get("http://localhost:3001/get-time")
    const fixTime = response.data.time

    const fixCheckOutTime = fixTime[0].fixCheckOut

    const getDate = now.toISOString().split("T")[0]

    const fixCheckOutFullDate = new Date(`${getDate} ${fixCheckOutTime}`)

    const different = now - fixCheckOutFullDate

    const diffInMinutes = Math.floor(different / (1000*60))
    const totalHour = (diffInMinutes / 60).toFixed(1)

    const existingRecord = await overTimeCount.findOne({user:user_id})

    if(existingRecord){
        const updateDiffInMinutes = existingRecord.overTimeCountMinute + diffInMinutes

        const updateTotalHour = existingRecord.overTimeCountHour + totalHour

        await overTimeCount.updateOne(
            {user:user_id},
            {$set:{overTimeCountMinute:updateDiffInMinutes, overTimeCountHour:updateTotalHour}}
        )
    }else{
        await overTimeCount.create({
            user:user_id,
            overTimeCountMinute:diffInMinutes,
            overTimeCountHour:totalHour
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

