<?php

declare(strict_types=1);

use App\Controllers\ImportarController;
use App\Middleware\AuthMiddleware;

/**
 * Rutas para el proceso de importación de productos
 */
return function($router) {
    // Nueva ruta para obtener la vista previa del catálogo sin importar
    $router->add(
        'GET', 
        '/api/importar/vista-previa', 
        [ImportarController::class, 'obtenerVistaPrevia'], 
        [AuthMiddleware::class, 'verifyToken']
    );

    // Solo permitimos ejecutar la importación mediante POST y con token de seguridad
    $router->add(
        'POST', 
        '/api/importar/ejecutar', 
        [ImportarController::class, 'ejecutarImportacion'], 
        [AuthMiddleware::class, 'verifyToken']
    );
};
