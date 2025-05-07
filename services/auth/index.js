const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")
const uploads = require("../../config/multer")
const bcrypt = require("bcryptjs")

// ------- Add User Api ------------


const addUser = asyncErrorHandler(async (req, res) => {

    uploads(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed', details: err.message });
        }

        
        const { name, email, password } = req.body;
       

        const imagePath = req.file ? req.file.path : null;
       

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS_CODES.CONFLICT).json({
                statusCode: STATUS_CODES.CONFLICT,
                message: TEXTS.CONFLICT
            });
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            email,
            password:hashPassword,
            image: imagePath
        });

        res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            message: TEXTS.CREATED
        });
    });
});





// ------- Login User Api ------------


const loginUser = asyncErrorHandler(async (req,res)=>{
    const {email,password} = req.body

    const existingUser = await User.findOne({email})

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    const comparePassword = await bcrypt.compare(password, existingUser.password)

    if(!comparePassword){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode:STATUS_CODES.CONFLICT,
            message:TEXTS.PASSWORD_NOT_MATCH
        })
    }

    const {_id,name,email:userEmail, role,image} = existingUser


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.LOGIN,
        user:{_id,name,email:userEmail,role,image}
    })
})


module.exports = {addUser, loginUser}