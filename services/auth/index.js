const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")


// ------- Add User Api ------------


const addUser = asyncErrorHandler
(async (req,res)=>{
    const {name,email,password} = req.body

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode:STATUS_CODES.CONFLICT,
            message:TEXTS.CONFLICT
        })
    }



    await User.create({
        name,
        email,
        password
    })


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.CREATED
    })
  
})

// ------- Login User Api ------------


const loginUser = asyncErrorHandler(async (req,res)=>{
    const {email,password} = req.body

    const existingUser = await User.findOne({email})

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    if(existingUser.password !== password){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.PASSWORD_NOT_MATCH
        })
    }


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.LOGIN
    })
})

// ------- Get All User Api ------------

const getAllUser = asyncErrorHandler(async (req,res)=>{
    const allUser = await User.find({})

    if(!allUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            status:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        allUser
    })
})

// ------- Search User Api ------------

const searchUser = asyncErrorHandler(async (req,res)=>{
    const {name} = req.query

    let query = {}

    if(name){
        query.name = {$regex:name, $options:"i"}
    }

    const users = await User.find(query)

    if(users.length === 0){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.SUCCESS,
        users
    })
})



module.exports = {addUser, loginUser, getAllUser, searchUser}