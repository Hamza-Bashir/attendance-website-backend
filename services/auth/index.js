const asyncErrorHandler = require("../../utilis/asyncErrorHandler")
const {STATUS_CODES,TEXTS} = require("../../config/constants")
const User = require("../../model/userSchema/index")
const uploads = require("../../config/multer")
const bcrypt = require("bcryptjs")
const {generateToken} = require("../../utilis/jwtToken")
const fs = require("fs")
const path = require("path")

// ------- Add User Api ------------


const addUser = asyncErrorHandler(async (req, res) => {


    uploads(req, res, async (err) => {
        if (err) {
            return res.status(STATUS_CODES.FAILED).json({ message: TEXTS.FILE_FAILED, details: err.message });
        }
        
        const { name, email, password } = req.body;
       
        const imagePath = req.file ? `uploads/${req.file.filename}` : null;
       
 
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

    const token = generateToken(existingUser)


    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.LOGIN,
        token,
        user:{_id,name,email:userEmail,role,image}
    })
})

// ------- Update User Api ------------

const updateUser = asyncErrorHandler(async (req,res)=>{
    uploads(req,res, async (err)=>{
        if(err){
            return res.status(STATUS_CODES.FAILED).json({
                message:TEXTS.FILE_FAILED,
                details:err.message
            })
        }
    })
    const {user_id} = req.params
    const query = {}

    const allowedField = ["name", "email", "password", "image"]


    const existingUser = await User.findById(user_id)

    if(!existingUser){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode:STATUS_CODES.NOT_FOUND,
            message:TEXTS.NOT_FOUND
        })
    }

    let imagePath = existingUser.image


    if(req.file){
        const imageName = path.basename(existingUser.image)
        const rootPath = path.resolve(__dirname, "..")
        const oldImagePath = path.join(rootPath, "..", "uploads",imageName)

        try {
            fs.unlinkSync(oldImagePath)
            console.log("Old file deleted successfully")
        } catch (error) {
            console.log(error.message)
        }
        imagePath = req.file ? `uploads/${req.file.filename}`:existingUser.image
    }
    

    allowedField.forEach((field)=>{
        if(req.body[field] !== undefined){
            query[field] = req.body[field]
        }
    })

    if(imagePath){
        query.image = imagePath
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, query, {new:true})

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode:STATUS_CODES.SUCCESS,
        message:TEXTS.UPDATED
    })


})


module.exports = {addUser, loginUser, updateUser}