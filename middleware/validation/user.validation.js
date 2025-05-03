const joi = require("joi")

const addUserSch = joi.object({
    name:joi.string().min(3).max(20).required().messages({
        "string.base":"Name must be string",
        "any.required":"Name is required",
        "string.min":"Name must be greater than 3 character",
        "string.max":"Name must be less than 20 character"
    }),
    email:joi.string().email().required().messages({
        "string.base":"Email must be string",
        "any.required":"Email is required",
        "string.email":"'Email' must be valid email"
    }),
    password:joi.string().min(5).max(20).required().messages({
        "string.base":"Password must be string",
        "any.required":"Paaword is required",
        "string.min":"Password must be greater than 5 character",
        "string.max":"Password must be less than 20 character"
    }),
    role:joi.string().valid("admin","employee").messages({
        "string.base":"Role must be string",
        "any.only":"Role must be either 'admin' or 'employee'"
    })

})


const loginUserSch = joi.object({
    
    email:joi.string().email().required().messages({
        "string.base":"Email must be string",
        "any.required":"Email is required",
        "string.email":"'Email' must be valid email"
    }),
    password:joi.string().min(5).max(20).required().messages({
        "string.base":"Password must be string",
        "any.required":"Paaword is required",
        "string.min":"Password must be greater than 5 character",
        "string.max":"Password must be less than 20 character"
    })

})



module.exports = {addUserSch, loginUserSch}