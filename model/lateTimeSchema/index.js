const mongoose = require("mongoose")

const lateTimeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    lateCountMinute:{
        type:Number
    },
    lateCountHours:{
        type:Number
    },
    rateOfDeductionPerHour:{
        type:Number,
        default:50
    },
    totalDeduction:{
        type:Number
    }

}, {
    timestamps:true
})

module.exports = mongoose.model("lateTimecount", lateTimeSchema)