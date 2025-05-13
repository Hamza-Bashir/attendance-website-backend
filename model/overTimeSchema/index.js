const mongoose = require("mongoose")

const overTimeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    overTimeCountMinute:{
        type:Number
    },
    overTimeCountHour:{
        type:Number
    },
    rateOfIncrement:{
        type:Number,
        default:100
    },
    totalIncrement:{
        type:Number
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("overTimeCount", overTimeSchema)