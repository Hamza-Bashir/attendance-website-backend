const mongoose = require("mongoose")

const timeSchema = new mongoose.Schema({
    fixCheckIn:{
        type:String,
        required:true
    },
    fixCheckOut:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("attendanceTime", timeSchema)