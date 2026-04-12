<?php
/**
 * 🔍 DIAGNÓSTICO AVANZADO - Backend PHP
 * Acceso: https://espumasyplasticos.com/api/diagnostico-avanzado.php
 * 
 * Este archivo captura todos los problemas posibles on Hostinger
 */

declare(strict_types=1);

// Habilitar todos los errores
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => [],
    'file_system' => [],
    'php_checks' => [],
    'autoloader' => [],
    'namespace_test' => [],
    'errors' => [],
    'recommendations' => []
];

// ═══════════════════════════════════════════════════════════════════════════
// 1. AMBIENTE
// ═══════════════════════════════════════════════════════════════════════════
$diagnostics['environment'] = [
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
    'os' => php_uname(),
    'sapi' => php_sapi_name(),
    'current_file' => __FILE__,
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'directory_separator' => DIRECTORY_SEPARATOR,
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. SISTEMA DE ARCHIVOS
// ═══════════════════════════════════════════════════════════════════════════
$basePath = __DIR__;

$folders = [
    'vendor' => $basePath . '/vendor',
    'Controllers' => $basePath . '/Controllers',
    'Config' => $basePath . '/Config',
    'Utils' => $basePath . '/Utils',
    'Middleware' => $basePath . '/Middleware',
    'routes' => $basePath . '/routes',
    'logs' => $basePath . '/logs',
];

foreach ($folders as $name => $path) {
    $exists = file_exists($path) || is_dir($path);
    $writable = is_writable($path);
    $diagnostics['file_system'][$name] = [
        'path' => $path,
        'exists' => $exists,
        'is_dir' => is_dir($path),
        'writable' => $writable ? 'yes' : 'no',
    ];
}

// Archivos críticos
$files = [
    '.env' => $basePath . '/.env',
    'composer.json' => $basePath . '/composer.json',
    'composer.lock' => $basePath . '/composer.lock',
    '.htaccess' => $basePath . '/.htaccess',
];

foreach ($files as $name => $path) {
    $diagnostics['file_system'][$name] = [
        'exists' => file_exists($path),
        'readable' => is_readable($path),
        'size' => file_exists($path) ? filesize($path) . ' bytes' : 'N/A'
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. VERIFICACIONES PHP
// ═══════════════════════════════════════════════════════════════════════════
$diagnostics['php_checks'] = [
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'max_execution_time' => ini_get('max_execution_time'),
    'memory_limit' => ini_get('memory_limit'),
    'pdo_available' => extension_loaded('pdo') ? 'yes' : 'NO',
    'pdo_mysql' => extension_loaded('pdo_mysql') ? 'yes' : 'NO',
    'json' => extension_loaded('json') ? 'yes' : 'NO',
    'curl' => extension_loaded('curl') ? 'yes' : 'NO',
    'mbstring' => extension_loaded('mbstring') ? 'yes' : 'NO',
];

// ═══════════════════════════════════════════════════════════════════════════
// 4. PRUEBA DE AUTOLOADER
// ═══════════════════════════════════════════════════════════════════════════
if (file_exists($basePath . '/vendor/autoload.php')) {
    try {
        require_once $basePath . '/vendor/autoload.php';
        $diagnostics['autoloader']['vendor_loaded'] = 'yes';
    } catch (\Exception $e) {
        $diagnostics['autoloader']['vendor_loaded'] = 'NO';
        $diagnostics['autoloader']['vendor_error'] = $e->getMessage();
    }

    // Pero el require puede haber fallado silenciosamente. Verificar que el autoloader existe
    if (class_exists('Composer\Autoload\ClassLoader')) {
        $diagnostics['autoloader']['composer_available'] = 'yes';
    } else {
        $diagnostics['autoloader']['composer_available'] = 'NO - Composer classes not found';
    }
} else {
    $diagnostics['autoloader']['vendor_found'] = 'NO - vendor/autoload.php does not exist';
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. PRUEBA DE NAMESPACES
// ═══════════════════════════════════════════════════════════════════════════
try {
    if (class_exists('App\Utils\Logger')) {
        $diagnostics['namespace_test']['App\Utils\Logger'] = '✅ OK';
    } else {
        $diagnostics['namespace_test']['App\Utils\Logger'] = '❌ NOT FOUND';
        $diagnostics['errors'][] = 'Logger class not found. Check if Utils folder name matches exactly.';
    }
} catch (\Throwable $e) {
    $diagnostics['namespace_test']['App\Utils\Logger'] = '❌ Error: ' . $e->getMessage();
}

try {
    if (class_exists('App\Controllers\AuthController')) {
        $diagnostics['namespace_test']['App\Controllers\AuthController'] = '✅ OK';
    } else {
        $diagnostics['namespace_test']['App\Controllers\AuthController'] = '❌ NOT FOUND';
        $diagnostics['errors'][] = 'AuthController not found. Check if Controllers folder name matches exactly.';
    }
} catch (\Throwable $e) {
    $diagnostics['namespace_test']['App\Controllers\AuthController'] = '❌ Error: ' . $e->getMessage();
}

try {
    if (class_exists('App\Config\Database')) {
        $diagnostics['namespace_test']['App\Config\Database'] = '✅ OK';
    } else {
        $diagnostics['namespace_test']['App\Config\Database'] = '❌ NOT FOUND';
        $diagnostics['errors'][] = 'Database class not found. Check if Config folder name matches exactly.';
    }
} catch (\Throwable $e) {
    $diagnostics['namespace_test']['App\Config\Database'] = '❌ Error: ' . $e->getMessage();
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. PRUEBA DE CONEXIÓN A BD
// ═══════════════════════════════════════════════════════════════════════════
try {
    if (class_exists('App\Config\Database')) {
        $db = \App\Config\Database::getConnection();
        $result = $db->query('SELECT 1')->fetch();
        if ($result) {
            $diagnostics['database'] = '✅ Connected successfully';
        } else {
            $diagnostics['database'] = '❌ Query executed but no result';
        }
    } else {
        $diagnostics['database'] = '❌ Database class not found';
    }
} catch (\Throwable $e) {
    $diagnostics['database'] = '❌ Error: ' . $e->getMessage();
    $diagnostics['errors'][] = 'Database connection failed: ' . $e->getMessage();
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. URI NORMALIZATION TEST
// ═══════════════════════════════════════════════════════════════════════════
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$scriptName = str_replace('\\', '/', $scriptName);

$diagnostics['uri_test'] = [
    'request_uri' => $_SERVER['REQUEST_URI'],
    'parsed_path' => $uri,
    'script_name' => $_SERVER['SCRIPT_NAME'],
    'dirname_script' => dirname($_SERVER['SCRIPT_NAME']),
    'normalized_scriptname' => $scriptName,
];

// Simular normalización
if ($scriptName !== '/' && $scriptName !== '') {
    $normalized_uri = preg_replace('#^' . preg_quote($scriptName, '#') . '#', '', $uri);
} else {
    $normalized_uri = $uri;
}

if ($normalized_uri === '' || $normalized_uri === null) $normalized_uri = '/';
if ($normalized_uri[0] !== '/') $normalized_uri = '/' . $normalized_uri;

$diagnostics['uri_test']['final_normalized_uri'] = $normalized_uri;

// ═══════════════════════════════════════════════════════════════════════════
// 8. RECOMENDACIONES
// ═══════════════════════════════════════════════════════════════════════════

if (count($diagnostics['errors']) === 0) {
    $diagnostics['recommendations'][] = '✅ No critical errors detected';
} else {
    foreach ($diagnostics['errors'] as $error) {
        $diagnostics['recommendations'][] = '❌ ' . $error;
    }
}

// Verificaciones específicas
if (!$diagnostics['file_system']['vendor']['exists']) {
    $diagnostics['recommendations'][] = 'Sube la carpeta vendor/ a Hostinger (genera localmente con composer install)';
}

if (!$diagnostics['file_system']['Config']['exists'] || 
    !$diagnostics['file_system']['Controllers']['exists'] ||
    !$diagnostics['file_system']['Utils']['exists']) {
    $diagnostics['recommendations'][] = 'Las carpetas Config/, Controllers/, Utils/ deben estar en MAYÚSCULA (CamelCase exacto)';
}

if (!$diagnostics['php_checks']['pdo_available'] || !$diagnostics['php_checks']['pdo_mysql']) {
    $diagnostics['recommendations'][] = 'PHP PDO o PDO MySQL no disponible. Contacta a Hostinger para habilitarlo';
}

if (strpos($diagnostics['environment']['os'], 'Windows') !== false) {
    $diagnostics['recommendations'][] = '⚠️ Estás en Windows. En Linux (Hostinger) las mayúsculas SON importantes';
}

// ═══════════════════════════════════════════════════════════════════════════
// SALIDA
// ═══════════════════════════════════════════════════════════════════════════
http_response_code(200);
echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
