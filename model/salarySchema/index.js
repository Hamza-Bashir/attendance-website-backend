const mongoose = require("mongoose")

const salarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    month:{
        type:String,
        
    },

    baseSalary:{
        type:Number,
       
    },

    lateCount:{
        type:Number,
       
    },

    lateDeductionPerDay:{
        type:Number,
       
    },

    totalLateDeduction:{
        type:Number,
       
    },

    overtimeHours:{
        type:Number,
       
    },

    overtimeRate:{
        type:Number,
        
    },

    totalOvertimePay:{
        type:Number,
        
    },

    finalSalary:{
        type:Number,
       
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("salary", salarySchema)