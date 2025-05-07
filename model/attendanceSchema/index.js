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
        required:true
    },
    checkOut:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

attendanceSchema.index({user:1, date:1}, {unique:true})

module.exports = mongoose.model("attendanceData", attendanceSchema)