// middleware/upload.middleware.js
const { createUploader, uploadToCloudinary } = require('../config/cloudinary');
const multer = require('multer');

// Middleware para upload de productos
const productUpload = (req, res, next) => {
  const uploadMiddleware = createUploader('espumas_plasticos_productos', 'imagen');
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('❌ Error en productUpload:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Error en upload de imagen del producto',
        error: err.message
      });
    }
    
    if (req.file) {
      try {
        console.log('📸 Subiendo archivo a Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, 'espumas_plasticos_productos');
        req.imageInfo = {
          url: result.secure_url,
          publicId: result.public_id,
          originalName: req.file.originalname,
          size: req.file.size
        };
      } catch (cloudinaryError) {
        console.error('❌ Error subiendo a Cloudinary:', cloudinaryError.message);
        return res.status(500).json({
          success: false,
          message: 'Error subiendo imagen a Cloudinary',
          error: cloudinaryError.message
        });
      }
    }
    
    next();
  });
};

// Middleware para upload de categorías
const categoryUpload = (req, res, next) => {
  const uploadMiddleware = createUploader('espumas_plasticos_categorias', 'icono');
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('❌ Error en categoryUpload:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Error en upload de icono de categoría',
        error: err.message
      });
    }
    
    if (req.file) {
      try {
        console.log('📸 Subiendo icono a Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, 'espumas_plasticos_categorias');
        req.imageInfo = {
          url: result.secure_url,
          publicId: result.public_id,
          originalName: req.file.originalname,
          size: req.file.size
        };
      } catch (cloudinaryError) {
        console.error('❌ Error subiendo a Cloudinary:', cloudinaryError.message);
        return res.status(500).json({
          success: false,
          message: 'Error subiendo icono a Cloudinary',
          error: cloudinaryError.message
        });
      }
    }
    
    next();
  });
};

// Middleware para upload de múltiples imágenes de productos
const productsMultipleUpload = (req, res, next) => {
  const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Formato no permitido'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array('imagenes', 5);
  
  multerMiddleware(req, res, async (err) => {
    console.log('🔍 Middleware productsMultipleUpload ejecutado');
    console.log('   req.files:', req.files ? `${req.files.length} archivos` : 'No recibidos');
    console.log('   Content-Type:', req.headers['content-type']);
    
    if (err) {
      console.error('❌ Error en productsMultipleUpload:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Error en upload de múltiples imágenes',
        error: err.message
      });
    }
    
    if (!req.files || req.files.length === 0) {
      console.warn('⚠️  No se recibieron archivos en el campo "imagenes"');
      req.imagesInfo = [];
      return next();
    }
    
    try {
      console.log(`📷 Subiendo ${req.files.length} imágenes a Cloudinary...`);
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'espumas_plasticos_productos')
      );
      const results = await Promise.all(uploadPromises);
      
      req.imagesInfo = results.map((result, index) => ({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.files[index].originalname,
        size: req.files[index].size
      }));
      
      console.log(`✅ ${req.imagesInfo.length} imágenes uploadadas correctamente`);
    } catch (cloudinaryError) {
      console.error('❌ Error subiendo a Cloudinary:', cloudinaryError.message);
      return res.status(500).json({
        success: false,
        message: 'Error subiendo imágenes a Cloudinary',
        error: cloudinaryError.message
      });
    }
    
    next();
  });
};

// Middleware para upload de múltiples imágenes (genérico, para otros usos)
const multipleUpload = (req, res, next) => {
  const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Formato no permitido'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array('imagenes', 5);
  
  multerMiddleware(req, res, async (err) => {
    if (err) {
      console.error('❌ Error en multipleUpload:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Error en upload de múltiples imágenes',
        error: err.message
      });
    }
    
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          uploadToCloudinary(file.buffer, 'espumas_plasticos_general')
        );
        const results = await Promise.all(uploadPromises);
        
        req.imagesInfo = results.map((result, index) => ({
          url: result.secure_url,
          publicId: result.public_id,
          originalName: req.files[index].originalname,
          size: req.files[index].size
        }));
      } catch (cloudinaryError) {
        console.error('❌ Error subiendo a Cloudinary:', cloudinaryError.message);
        return res.status(500).json({
          success: false,
          message: 'Error subiendo imágenes a Cloudinary',
          error: cloudinaryError.message
        });
      }
    }
    
    next();
  });
};

module.exports = {
  productUpload,
  categoryUpload,
  multipleUpload,
  productsMultipleUpload
};
