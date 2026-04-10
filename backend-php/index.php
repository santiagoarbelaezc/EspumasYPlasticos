<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Utils\Response;
use App\Utils\Logger;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Configuración de errores global para el log de la app
set_exception_handler(function($e) {
    Logger::error("🔥 EXCEPCIÓN NO CONTROLADA: " . $e->getMessage());
    Logger::error("📍 Trace: " . $e->getTraceAsString());
    Response::error("Error interno del servidor", 500, $e->getMessage());
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) return false;
    $msg = "⚠️ ERROR PHP ($errno): $errstr en $errfile:$errline";
    Logger::warning($msg);
    if ($errno === E_ERROR || $errno === E_CORE_ERROR || $errno === E_COMPILE_ERROR) {
        Response::error("Error fatal en el servidor", 500, $msg);
    }
    return true;
});

// Configuración de CORS - Más permisiva para depuración
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Log incoming request
Logger::request($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

/**
 * Clase Router minimalista para manejar las peticiones
 */
class Router {
    private array $routes = [];

    public function add(string $method, string $path, $handler, $middleware = null): void {
        // Convertir {id} a regex
        $regexPath = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([a-zA-Z0-9_]+)', $path);
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => "#^" . $regexPath . "$#",
            'handler' => $handler,
            'middleware' => $middleware
        ];
    }

    public function dispatch(): void {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];

        // Soporte para _method en POST (Method Spoofing para PUT/DELETE)
        if ($method === 'POST' && isset($_POST['_method'])) {
            $method = strtoupper($_POST['_method']);
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['path'], $uri, $matches)) {
                array_shift($matches); // Quitar la coincidencia completa

                // Log matching route
                Logger::info("Route matched: " . $route['method'] . " " . $uri);

                // Ejecutar middleware si existe
                if ($route['middleware']) {
                    call_user_func($route['middleware']);
                }

                // Ejecutar handler
                // Convertimos parámetros numéricos a int para evitar errores con strict_types=1
                $params = array_map(fn($m) => is_numeric($m) ? (int)$m : $m, $matches);
                call_user_func_array($route['handler'], $params);
                return;
            }
        }

        Response::error("Ruta no encontrada: $method $uri", 404);
    }
}

$router = new Router();

// Cargar rutas desde los archivos
(require __DIR__ . '/routes/auth.routes.php')($router);
(require __DIR__ . '/routes/categoria.routes.php')($router);
(require __DIR__ . '/routes/subcategoria.routes.php')($router);
(require __DIR__ . '/routes/producto.routes.php')($router);
(require __DIR__ . '/routes/importar.routes.php')($router);

// Health check para Elastic Beanstalk o similares
$router->add('GET', '/health', function() {
    Response::success(['status' => 'ok', 'message' => 'Backend PHP is healthy']);
});

// Despachar la petición
$router->dispatch();
