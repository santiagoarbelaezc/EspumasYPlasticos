<?php

declare(strict_types=1);

use App\Controllers\ImportarController;
use App\Middleware\AuthMiddleware;

return function($router) {
    // Ruta protegida: Solo administradores logueados pueden ejecutar la importación
    $router->add('POST', '/api/importar/ejecutar', [ImportarController::class, 'ejecutarImportacion'], [AuthMiddleware::class, 'verifyToken']);
};
