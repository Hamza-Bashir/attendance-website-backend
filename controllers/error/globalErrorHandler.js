const globalError = (err,req,res,next)=>{
    let statusCode = err.statusCode || 500;

    let message = err.message || "Something went wrong"

    res.status(statusCode).json({
        success:false,
        status:statusCode,
        message:message
    })
}

module.exports = globalError