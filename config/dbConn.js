const mongoose = require("mongoose")


const db = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Database connection established successfully")
    } catch (error) {
        console.log("Database not connected ", error.message)
    }

}

module.exports = db

