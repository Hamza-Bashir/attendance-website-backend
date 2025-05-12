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

    const existingTime = await timeSchema.findById({user_id:req.user._id})

    if(existingTime){
        await timeSchema.updateOne()
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




module.exports = {addTime}