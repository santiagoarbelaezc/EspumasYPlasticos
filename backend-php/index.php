<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Utils\Response;
use App\Utils\Logger;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Configuración de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

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
                call_user_func_array($route['handler'], $matches);
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

// Health check para Elastic Beanstalk o similares
$router->add('GET', '/health', function() {
    Response::success(['status' => 'ok', 'message' => 'Backend PHP is healthy']);
});

// Despachar la petición
$router->dispatch();
