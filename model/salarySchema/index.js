const mongoose = require("mongoose")

const salarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    baseSalary:{
        type:Number,  
    },
    finalSalary:{
        type:Number
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("salary", salarySchema)