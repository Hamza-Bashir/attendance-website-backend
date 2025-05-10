const mongoose = require("mongoose")

const salarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    month:{
        type:String,
        required:true
    },

    baseSalary:{
        type:Number,
        required:true
    },

    lateCount:{
        type:Number,
        required:true
    },

    lateDeductionPerDay:{
        type:Number,
        default:0
    },

    totalLateDeduction:{
        type:Number,
        default:0
    },

    overtimeHours:{
        type:Number,
        default:0
    },

    overtimeRate:{
        type:Number,
        default:0
    },

    totalOvertimePay:{
        type:Number,
        default:0
    },

    finalSalary:{
        type:Number,
        required:true
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("salary", salarySchema)