<?php

declare(strict_types=1);

use App\Controllers\ProductoController;
use App\Middleware\AuthMiddleware;

return function($router) {
    $router->add('GET', '/producto', [ProductoController::class, 'obtenerProductos']);
    $router->add('GET', '/producto/aleatorios', [ProductoController::class, 'obtenerProductosAleatorios']);
    $router->add('GET', '/producto/categoria/{id}', [ProductoController::class, 'obtenerProductosPorCategoria']);
    $router->add('GET', '/producto/buscar/nombre', [ProductoController::class, 'buscarProductosPorNombre']);
    $router->add('GET', '/producto/{id}', [ProductoController::class, 'obtenerProductoPorId']);
    
    // Rutas protegidas (Se usarán con POST y _method=PUT para multipart en PHP si es necesario, 
    // o el router manejará el método real si el server lo permite)
    $router->add('POST', '/producto', [ProductoController::class, 'crearProducto'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('PUT', '/producto/{id}', [ProductoController::class, 'actualizarProducto'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('DELETE', '/producto/{id}', [ProductoController::class, 'eliminarProducto'], [AuthMiddleware::class, 'verifyToken']);
};
