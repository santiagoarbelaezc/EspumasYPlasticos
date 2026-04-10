<?php
declare(strict_types=1);

// No requerir autoload inmediatamente para evitar crash si no existe
$vendorFound = file_exists(__DIR__ . '/vendor/autoload.php');

header('Content-Type: application/json');

$results = [
    'diagnostic_time' => date('Y-m-d H:i:s'),
    'vendor_folder' => $vendorFound ? 'FOUND' : 'MISSING',
    'env_file' => file_exists(__DIR__ . '/.env') ? 'FOUND' : 'MISSING',
    'db_connection' => 'not_tested',
    'errors' => []
];

if (!$vendorFound) {
    $results['errors'][] = "CRITICAL: The 'vendor' folder is missing. You must upload it or run 'composer install' on Hostinger.";
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;

try {
    // 1. Cargar Variables de Entorno
    $dotenv = Dotenv::createImmutable(__DIR__);
    try {
        $dotenv->load(); // Usar load() para ver errores si falla
        $results['env_content_check'] = isset($_ENV['DB_NAME']) ? 'OK' : 'EMPTY or UNREADABLE';
    } catch (\Exception $e) {
        $results['errors'][] = "Dotenv error: " . $e->getMessage();
    }
    
    // 2. Probar Conexión DB
    try {
        $db = Database::getConnection();
        $results['db_connection'] = 'SUCCESS';
    } catch (\Exception $e) {
        $results['db_connection'] = 'FAILED';
        $results['errors'][] = "Database connection error: " . $e->getMessage();
    }

} catch (\Exception $e) {
    $results['errors'][] = "General diagnostic error: " . $e->getMessage();
}

echo json_encode($results, JSON_PRETTY_PRINT);
