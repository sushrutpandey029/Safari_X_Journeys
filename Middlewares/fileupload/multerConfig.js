import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define destination folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'Uploads/ProfileImages/guide';
        fs.mkdirSync(uploadPath, { recursive: true }); // make sure folder exists
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to allow only images (optional)
const fileFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg, or .png files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // limit to 2MB
});

export default upload;
