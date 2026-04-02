<?php

declare(strict_types=1);

use App\Controllers\CategoriaController;
use App\Middleware\AuthMiddleware;

return function($router) {
    $router->add('GET', '/api/categoria', [CategoriaController::class, 'obtenerCategorias']);
    $router->add('GET', '/api/categoria/con-subcategorias', [CategoriaController::class, 'obtenerCategoriasConSubcategorias']);
    
    // Rutas protegidas
    $router->add('POST', '/api/categoria', [CategoriaController::class, 'crearCategoria'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('PUT', '/api/categoria/{id}', [CategoriaController::class, 'actualizarCategoria'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('DELETE', '/api/categoria/{id}', [CategoriaController::class, 'eliminarCategoria'], [AuthMiddleware::class, 'verifyToken']);
};
