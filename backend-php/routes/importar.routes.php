<?php

declare(strict_types=1);

use App\Controllers\ImportarController;
use App\Middleware\AuthMiddleware;

/**
 * Rutas para el proceso de importación de productos
 */
return function($router) {
    $router->add(
        'GET', 
        '/importar/vista-previa', 
        [ImportarController::class, 'obtenerVistaPrevia'], 
        [AuthMiddleware::class, 'verifyToken']
    );

    // Solo permitimos ejecutar la importación mediante POST y con token de seguridad
    $router->add(
        'POST', 
        '/importar/ejecutar', 
        [ImportarController::class, 'ejecutarImportacion'], 
        [AuthMiddleware::class, 'verifyToken']
    );
};
