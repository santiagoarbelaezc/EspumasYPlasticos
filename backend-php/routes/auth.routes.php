<?php

declare(strict_types=1);

use App\Controllers\AuthController;

return function($router) {
    $router->add('POST', '/api/auth/login', [AuthController::class, 'login']);
    $router->add('POST', '/api/auth/register', [AuthController::class, 'register']);
    $router->add('POST', '/api/auth/logout', [AuthController::class, 'logout']);
    $router->add('POST', '/api/auth/refresh-token', [AuthController::class, 'refreshToken']);
};
