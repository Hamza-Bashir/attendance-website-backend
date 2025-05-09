const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")
const attendance = require("../../model/attendanceSchema/index")
const path = require("path")
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

const setLateTimeLimit = asyncErrorHandler(async (req,res)=>{
    const {limitTime} = req.body

    const updateUser = await User.updateMany({role:"employee"}, {lateTimeLimit:limitTime})

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SET_TIME
    })
})


module.exports = {getAllUser, searchUser, deleteUser, getAllattendace, searchAttendanceByName, setLateTimeLimit}