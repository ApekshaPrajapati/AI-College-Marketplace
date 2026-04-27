const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'marketplace/images',
    resource_type: 'image',
    public_id: Date.now() + '-' + file.originalname.replace(/\s/g, '-'),
  })
});

// File storage — PDF, PPT, DOCX
const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'marketplace/files',
    resource_type: 'raw',         // ← must be raw for PDFs
    public_id: Date.now() + '-' + file.originalname.replace(/\s/g, '-'),
  })
});

const uploadImage = multer({ 
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    console.log('Image received:', file.originalname, file.mimetype)
    cb(null, true)
  }
});

const uploadFile = multer({ 
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.originalname, file.mimetype)
    cb(null, true)   // accept all formats
  }
});

// Upload image route
router.post('/image', auth, (req, res) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      console.log('IMAGE UPLOAD ERROR:', err.message)
      return res.status(500).json({ msg: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'No image received' })
    }
    console.log('Image uploaded:', req.file.path)
    res.json({ imageUrl: req.file.path })
  })
});

// Upload file route
router.post('/file', auth, (req, res) => {
  uploadFile.single('file')(req, res, (err) => {
    if (err) {
      console.log('FILE UPLOAD ERROR:', err.message)
      return res.status(500).json({ msg: err.message })
    }
    if (!req.file) {
      console.log('NO FILE RECEIVED — check field name')
      return res.status(400).json({ msg: 'No file received' })
    }
    console.log('File uploaded OK:', req.file.path)
    res.json({ fileUrl: req.file.path, fileFormat: req.file.mimetype })
  })
});

module.exports = router;