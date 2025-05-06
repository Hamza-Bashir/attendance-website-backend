const mongoose = require("mongoose")

const userSch = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        allowNull:false,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin", "employee"],
        default:"employee"
    },
    image:{
        type:String
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("user", userSch)