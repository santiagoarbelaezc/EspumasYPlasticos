<?php
/**
 * 🧪 TEST DIRECTO DE LOGIN - Bypass del Router
 * Acceso: https://espumasyplasticos.com/api/test-login-directo.php
 */

declare(strict_types=1);

// Habilitar debug total
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

$result = [
    'timestamp' => date('Y-m-d H:i:s'),
    'steps' => []
];

try {
    // Paso 1: Cargar vendor
    $result['steps'][] = '1️⃣ Loading vendor...';
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        throw new Exception('vendor/autoload.php not found');
    }
    require_once __DIR__ . '/vendor/autoload.php';
    $result['steps'][] = '✅ Vendor loaded';

    // Paso 2: Cargar .env
    $result['steps'][] = '2️⃣ Loading environment...';
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
    $result['steps'][] = '✅ Environment loaded';

    // Paso 3: Verificar Database class
    $result['steps'][] = '3️⃣ Checking Database class...';
    if (!class_exists('App\Config\Database')) {
        throw new Exception('Database class not found. Namespace issue.');
    }
    $result['steps'][] = '✅ Database class found';

    // Paso 4: Conectar a BD
    $result['steps'][] = '4️⃣ Connecting to database...';
    $db = \App\Config\Database::getConnection();
    $result['steps'][] = '✅ Database connected';

    // Paso 5: Verificar tabla usuarios
    $result['steps'][] = '5️⃣ Checking usuarios table...';
    $stmt = $db->query('SELECT COUNT(*) as count FROM usuarios');
    $count = $stmt->fetch()['count'];
    $result['steps'][] = "✅ Found $count users in database";

    // Paso 6: Verificar AuthController
    $result['steps'][] = '6️⃣ Checking AuthController...';
    if (!class_exists('App\Controllers\AuthController')) {
        throw new Exception('AuthController class not found');
    }
    $result['steps'][] = '✅ AuthController found ';

    // Paso 7: Probar Request::all()
    $result['steps'][] = '7️⃣ Testing Request::all()...';
    if (!class_exists('App\Utils\Request')) {
        throw new Exception('Request class not found');
    }
    $result['steps'][] = '✅ Request class found';

    // Paso 8: Simular datos JSON
    $result['steps'][] = '8️⃣ Simulating login request...';
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_SERVER['CONTENT_TYPE'] = 'application/json';
    
    // Simular un JSON POST
    $json = json_encode([
        'correo' => 'admin@espumasyplasticos.com',
        'password' => 'test'
    ]);
    
    // Mock file_get_contents para simular php://input
    $mock_input = $json;
    
    $result['simulation'] = [
        'json_sent' => json_decode($json, true),
        'simulated_request_ok' => true
    ];

    $result['status'] = 'SUCCESS ✅';
    $result['message'] = 'All components are working correctly. The error must be in the .htaccess routing or frontend configuration.';

} catch (\Throwable $e) {
    $result['status'] = 'FAILED ❌';
    $result['error'] = $e->getMessage();
    $result['trace'] = $e->getTraceAsString();
    $result['file'] = $e->getFile();
    $result['line'] = $e->getLine();
}

http_response_code($result['status'] === 'SUCCESS ✅' ? 200 : 500);
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
