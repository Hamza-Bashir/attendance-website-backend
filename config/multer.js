const multer = require("multer");
const path = require("path");

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure that the callback (cb) is used correctly
        cb(null, path.join(__dirname, '..', 'uploads'));  // Correct path for the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename by appending the current timestamp
        cb(null, Date.now() + path.extname(file.originalname));  // Set the filename
    }
});

// Multer configuration with file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }  // Max file size of 5MB
}).single("image");  // 'image' is the name of the field in the form where the file is uploaded

// Export the upload middleware so it can be used in other parts of the application
module.exports = upload;
