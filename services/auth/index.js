const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")

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


module.exports = {addUser}