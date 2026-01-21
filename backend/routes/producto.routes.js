const express = require('express');
const router = express.Router();

// 🔐 Middleware para verificar JWT del usuario
const verifyToken = require('../middleware/auth.middleware');

// 📤 Middleware de upload para múltiples imágenes de productos
const { productsMultipleUpload } = require('../middleware/upload.middleware');

// 🎯 Controlador de lógica de productos
const controller = require('../controllers/producto.controller');

// =====================
// 📦 Rutas públicas
// =====================

// Obtener todos los productos con sus imágenes
router.get('/', controller.obtenerProductos);

// Obtener productos aleatorios
router.get('/aleatorios', controller.obtenerProductosAleatorios);

// Obtener todos los productos de una categoría
router.get('/categoria/:categoria_id', controller.obtenerProductosPorCategoria);

// Buscar productos por nombre o similares
router.get('/buscar/nombre', controller.buscarProductosPorNombre);

// Obtener un producto individual con todas sus imágenes
router.get('/:id', controller.obtenerProductoPorId);

// ============================
// 🔒 Rutas protegidas con JWT
// 📷 Imágenes vía FormData
// ============================

// Crear producto con hasta 5 imágenes (campo: imagenes[])
router.post(
  '/',
  verifyToken,
  productsMultipleUpload,
  controller.crearProductoDesdeRuta
);

// Actualizar producto y reemplazar imágenes completamente si se suben nuevas
router.put(
  '/:id',
  verifyToken,
  productsMultipleUpload,
  controller.actualizarProducto
);

// Eliminar producto y todas sus imágenes asociadas
router.delete('/:id', verifyToken, controller.eliminarProducto);

// 📤 Exportación del router
module.exports = router;
