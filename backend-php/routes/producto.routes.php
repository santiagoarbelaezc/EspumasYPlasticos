<?php

declare(strict_types=1);

use App\Controllers\ProductoController;
use App\Middleware\AuthMiddleware;

return function($router) {
    $router->add('GET', '/api/producto', [ProductoController::class, 'obtenerProductos']);
    $router->add('GET', '/api/producto/aleatorios', [ProductoController::class, 'obtenerProductosAleatorios']);
    $router->add('GET', '/api/producto/categoria/{id}', [ProductoController::class, 'obtenerProductosPorCategoria']);
    $router->add('GET', '/api/producto/buscar/nombre', [ProductoController::class, 'buscarProductosPorNombre']);
    $router->add('GET', '/api/producto/{id}', [ProductoController::class, 'obtenerProductoPorId']);
    
    // Rutas protegidas (Se usarán con POST y _method=PUT para multipart en PHP si es necesario, 
    // o el router manejará el método real si el server lo permite)
    $router->add('POST', '/api/producto', [ProductoController::class, 'crearProducto'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('PUT', '/api/producto/{id}', [ProductoController::class, 'actualizarProducto'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('DELETE', '/api/producto/{id}', [ProductoController::class, 'eliminarProducto'], [AuthMiddleware::class, 'verifyToken']);
};
