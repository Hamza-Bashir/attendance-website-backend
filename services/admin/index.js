const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")
const attendance = require("../../model/attendanceSchema/index")
const Salary = require("../../model/salarySchema/index")
const path = require("path")
const lateTimeCount = require("../../model/lateTimeSchema/index")
const overTimeCount = require("../../model/overTimeSchema/index")
const fs = require("fs")
const mongoose = require("mongoose")

// ----------- Get All User -------

const getAllUser = asyncErrorHandler(async (req,res)=>{
    const allUser = await User.find({role:"employee"})

    if(!allUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        allUser
    })
})


// ----------- Search User -------

const searchUser = asyncErrorHandler(async (req,res)=>{
    const query = {}
    const {name} = req.query
    if(name){
        query.name = {$regex:name, $options:"i"}
    }

    query.role = "employee"

    const findUser = await User.find(query)

    if(!findUser || findUser.length === 0){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        findUser
    })
})

// ----------- Delete User -------

const deleteUser = asyncErrorHandler(async (req,res)=>{
    const {user_id} = req.body

    const user = await User.findById(user_id)

    if(!user){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    if(user.image){
        const imageName = path.basename(user.image)
        const rootPath = path.resolve(__dirname, "..")
        const oldImagePath = path.join(rootPath, "..", "uploads", imageName)

        try {
            fs.unlinkSync(oldImagePath)
        } catch (error) {
            console.log(error.message)
        }
    }

    await User.findByIdAndDelete(user_id)
    await attendance.deleteMany({user: mongoose.Types.ObjectId(user_id)})
    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.DELETED
    })
    
})

// ----------- Get All attendance -------

const getAllattendace = asyncErrorHandler(async (req,res)=>{
    const getAllAttendance = await attendance.find({})

    if(!getAllAttendance || getAllAttendance.length === 0){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        getAllAttendance
    })
})

// ----------- Search attendance by Name -------

const searchAttendanceByName = asyncErrorHandler(async (req,res)=>{
    const query = {}
    const {name} = req.query
    if(name){
        query.name = {$regex:name, $options:"i"}
    }

    const searchAttendance = await attendance.find(query)

    if(searchAttendance.length === 0 || !searchAttendance){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        searchAttendance
    })
})

// ----------- Set late time limit -------

const setLateTimeLimit = asyncErrorHandler(async (req,res)=>{
    const {limitTime} = req.body

    const updateUser = await User.updateMany({role:"employee"}, {lateTimeLimit:limitTime})

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SET_TIME
    })
})


// ----------- Add salary -------


const addSalary = asyncErrorHandler(async (req,res)=>{
    const {user_id} = req.params
    const {salary} = req.body

    if(!user_id){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.ID_REQUIRED
        })
    }

    const existingUser = await User.findById(user_id)

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    const newSalary = await Salary.create({
        user:existingUser._id,
        baseSalary:salary
    })

    await User.findByIdAndUpdate(user_id, {

        salary:newSalary
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:"Salary added successfully"
    })
})


// ----------- Add late time rate deduction -------

const addLateTimeDeduction = asyncErrorHandler(async (req,res)=>{
    const {rate} = req.body

    await lateTimeCount.updateMany(
        {},
        {$set:{rateOfDeductionPerHour:rate}}
    )

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.UPDATED
    })
})

// ----------- Generate salary slip -------

const generateSalarySlip = asyncErrorHandler(async (req,res)=>{
    const now = new Date()
    const month = now.getMonth()
    const {user_id} = req.params
    const existingSalary = await Salary.findOne({user:user_id})
    const {baseSalary} = existingSalary

    const existingLateRecord = await lateTimeCount.findOne({user:user_id})

    const {lateCountHours,rateOfDeductionPerHour} = existingLateRecord

    const lateTimeDeductionPrice = lateCountHours * rateOfDeductionPerHour

    const existingOverTimeRecord = await overTimeCount.findOne({
        user:user_id
    })

    const {overTimeCountHour,rateOfIncrement} = existingOverTimeRecord

    const overTimeIncrementPrice = overTimeCountHour * rateOfIncrement

    const finalSalary = (baseSalary + overTimeIncrementPrice) - lateTimeDeductionPrice

    await Salary.create({
        user:user_id,
        month,
        baseSalary,
        lateTimeDeductionPrice,
        overTimeIncrementPrice,
        finalSalary
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:"Salary slip generate successfully"
    })
})





module.exports = {getAllUser, searchUser, deleteUser, getAllattendace, searchAttendanceByName, setLateTimeLimit, addSalary, addLateTimeDeduction, generateSalarySlip}