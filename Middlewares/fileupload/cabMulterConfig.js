
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'Uploads/ProfileImages/cab';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);
    cb(isValid ? null : new Error('Only .jpeg, .jpg, .png allowed'), isValid);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});


export default upload.single('image'); 
