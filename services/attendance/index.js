const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const attendance = require("../../model/attendanceSchema/index")
const User = require("../../model/userSchema/index")
const lateTimeCount = require("../../model/lateTimeSchema/index")
const overTimeCount = require("../../model/overTimeSchema/index")
const axios = require("axios")



// --------- Add attendance ----------

const addAttendance = asyncErrorHandler(async (req, res) => {
    const _id = req.user._id;
  
    const existingUser = await User.findOne({ _id });
  
    if (!existingUser) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: TEXTS.NOT_FOUND,
      });
    }
  
    const now = new Date();
  
    // Get fixed check-in time from another API
    const response = await axios.get("http://localhost:3001/get-time");
    const fixTime = response.data.time;
    const fixCheckInTime = fixTime[0].fixCheckIn;
  
    // Build date string
    const getDate = now.toISOString().split("T")[0];
    const fixCheckInFullDate = new Date(`${getDate} ${fixCheckInTime}`);
  
    // Calculate difference in time
    const different = now - fixCheckInFullDate;
    const diffInMinutes = Math.floor(different / (1000 * 60));
    const totalHour = parseFloat((diffInMinutes / 60).toFixed(1)); // Convert to number
  
    const isLate = diffInMinutes > 0;

    const existingAttendance = await attendance.findOne({user:_id,date:getDate})

    if(existingAttendance){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode:STATUS_CODES.CONFLICT,
            message:"You already check in"
        })
    }
  
    const existingRecord = await lateTimeCount.findOne({ user: _id });
  
    if (existingRecord) {
      const updateDiffInMinutes = Number(existingRecord.lateCountMinute) + diffInMinutes;
      const updateTotalHour = Number(existingRecord.lateCountHours) + totalHour;
  
      await lateTimeCount.updateOne(
        { user: _id },
        {
          $set: {
            lateCountMinute: updateDiffInMinutes,
            lateCountHours: updateTotalHour,
          },
        }
      );
    } else {
      await lateTimeCount.create({
        user: _id,
        lateCountMinute: diffInMinutes,
        lateCountHours: totalHour,
      });
    }
  
    

    await attendance.create({
      user: _id,
      date: getDate,
      checkIn: now,
      isLate,
    });
  
    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: "Add check in successfully",
    });
  });
  


// --------- Add checkOutTime ----------

const addCheckOut = asyncErrorHandler(async (req,res)=>{
    const _id = req.user._id
    const {attendance_id} = req.body

    const now = new Date()

    if(!_id){
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
    const totalHour = Number((diffInMinutes / 60).toFixed(1))

    const existingRecord = await overTimeCount.findOne({user:_id})

    if(existingRecord){
        const updateDiffInMinutes = Number(existingRecord.overTimeCountMinute) + diffInMinutes

        const updateTotalHour = Number(existingRecord.overTimeCountHour) + totalHour

        await overTimeCount.updateOne(
            {user:_id},
            {$set:{overTimeCountMinute:updateDiffInMinutes, overTimeCountHour:updateTotalHour}}
        )
    }else{
        await overTimeCount.create({
            user:_id,
            overTimeCountMinute:diffInMinutes,
            overTimeCountHour:totalHour
        })
    }

    const attendanceRecord = await attendance.findById(attendance_id)

    if(attendanceRecord.checkOut){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode:STATUS_CODES.CONFLICT,
            message:"You already check out"
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
    const id = req.user._id

    const previousAttendance = await attendance.find(
        {
            user:id
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

// --------- Get single attendance ----------

const getSingleAttendance = asyncErrorHandler(async (req,res)=>{
    const _id = req.user._id

    if(!_id){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.ID_REQUIRED
        })
    }

    const existingUser = await User.findOne({_id:_id})

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    const singleRecord = await attendance.findOne({user:_id}).sort({createdAt:-1})

    if(!singleRecord){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        singleRecord
    })
})


module.exports = {addAttendance, addCheckOut, getAllAttendance, searchAttendance, getSingleAttendance}

