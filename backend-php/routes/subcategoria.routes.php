<?php

declare(strict_types=1);

use App\Controllers\SubcategoriaController;
use App\Middleware\AuthMiddleware;

return function($router) {
    $router->add('GET', '/api/subcategoria', [SubcategoriaController::class, 'obtenerSubcategorias']);
    
    // Rutas protegidas
    $router->add('POST', '/api/subcategoria', [SubcategoriaController::class, 'crearSubcategoria'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('PUT', '/api/subcategoria/{id}', [SubcategoriaController::class, 'actualizarSubcategoria'], [AuthMiddleware::class, 'verifyToken']);
    $router->add('DELETE', '/api/subcategoria/{id}', [SubcategoriaController::class, 'eliminarSubcategoria'], [AuthMiddleware::class, 'verifyToken']);
};
