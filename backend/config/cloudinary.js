const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lizheng_auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
    },
});

module.exports = { cloudinary, storage };
