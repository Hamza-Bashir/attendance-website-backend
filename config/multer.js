const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));  
    },
    filename: (req, file, cb) => {
       
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }  
}).single("image");  
module.exports = upload;
