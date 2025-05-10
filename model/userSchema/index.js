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
    lateTimeLimit:{
        type:Number,
        default:10 
    },
    image:{
        type:String
        
    }
}, {
    timestamps:true,
    strict:false
})

module.exports = mongoose.model("user", userSch)