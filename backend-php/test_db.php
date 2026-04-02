<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Database;
use Dotenv\Dotenv;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

header('Content-Type: application/json');

try {
    echo "🔍 Probando conexión a la base de datos...\n";
    $db = Database::getConnection();
    
    $version = $db->query('SELECT VERSION()')->fetchColumn();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Conexión exitosa',
        'mysql_version' => $version,
        'config' => [
            'host' => $_ENV['DB_HOST'] ?? 'no definido',
            'database' => $_ENV['DB_NAME'] ?? 'no definido',
            'user' => $_ENV['DB_USER'] ?? 'no definido'
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en la prueba de conexión',
        'details' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
