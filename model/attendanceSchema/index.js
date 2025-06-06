const mongoose = require("mongoose")


const attendanceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    checkIn:{
        type:Date,
        default:null
    },
    checkOut:{
        type:Date,
        default:null
    },
    isLate:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})



module.exports = mongoose.model("attendanceData", attendanceSchema)