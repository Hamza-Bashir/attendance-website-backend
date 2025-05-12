const asyncErrorHandler = require("../../utilis/asyncErrorHandler")

const {STATUS_CODES, TEXTS} = require("../../config/constants")

const timeSchema = require("../../model/attendanceTimeSchema.js/index")



// ---------------- Add Time -------------

const addTime = asyncErrorHandler(async (req,res)=>{
    const {setCheckInTime, setCheckOutTime} = req.body

    if(!setCheckInTime || !setCheckOutTime){
        return res.status(STATUS_CODES.REQUIRED).json({
            statusCode:STATUS_CODES.REQUIRED,
            message:TEXTS.REQUIRED
        })
    }

    const existingTime = await timeSchema.findOne({user_id:req.user._id})

    if(existingTime){
        await timeSchema.updateOne({
            fixCheckIn:setCheckInTime,
            fixCheckOut:setCheckOutTime
        })
        return res.status(STATUS_CODES.SUCCESS).json({
            statusCode:STATUS_CODES.SUCCESS,
            message:TEXTS.UPDATED
        })
    }

    await timeSchema.create({
        fixCheckIn:setCheckInTime,
        fixCheckOut:setCheckOutTime,
        user_id:req.user._id
    })


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:"Fix time set successfully"
    })
})


// ---------------- Get Time -------------

const getTime = asyncErrorHandler(async (req,res)=>{
    const getData = await timeSchema.find({}, {_id:1, fixCheckIn:1,fixCheckOut:1})

    if(!getData){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        time:getData
    })
})



module.exports = {addTime, getTime}