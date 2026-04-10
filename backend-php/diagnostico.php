<?php
/**
 * 🔍 DIAGNÓSTICO PARA HOSTINGER
 * Acceso: http://tucio.com/api/diagnostico.php
 * 
 * Este archivo ayuda a identificar problemas de configuración en el hosting
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [],
    'apache_modules' => [],
    'php_extensions' => [],
    'file_system' => [],
    'path_info' => [],
    'headers' => [],
    'recommendations' => []
];

// ═══════════════════════════════════════════════════════════════════════════
// 1. INFORMACIÓN DEL SERVIDOR
// ═══════════════════════════════════════════════════════════════════════════
$diagnostics['server_info'] = [
    'php_version' => phpversion(),
    'sapi_name' => php_sapi_name(),
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'N/A',
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'N/A',
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'N/A',
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. MÓDULOS DE APACHE
// ═══════════════════════════════════════════════════════════════════════════
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    $diagnostics['apache_modules'] = [
        'mod_rewrite' => in_array('mod_rewrite', $modules),
        'mod_headers' => in_array('mod_headers', $modules),
        'mod_deflate' => in_array('mod_deflate', $modules),
        'mod_ssl' => in_array('mod_ssl', $modules),
        'all_modules' => $modules
    ];
} else {
    $diagnostics['apache_modules']['error'] = 'apache_get_modules() no disponible (posible Nginx u otro servidor)';
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. EXTENSIONES PHP NECESARIAS
// ═══════════════════════════════════════════════════════════════════════════
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'curl', 'mbstring', 'fileinfo'];
foreach ($required_extensions as $ext) {
    $diagnostics['php_extensions'][$ext] = extension_loaded($ext) ? 'DISPONIBLE' : 'FALTA';
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SISTEMA DE ARCHIVOS
// ═══════════════════════════════════════════════════════════════════════════
$base_dir = __DIR__;
$diagnostics['file_system'] = [
    'base_directory' => $base_dir,
    'is_writable' => is_writable($base_dir),
    'vendor_exists' => file_exists($base_dir . '/vendor/autoload.php'),
    '.env_exists' => file_exists($base_dir . '/.env'),
    '.htaccess_exists' => file_exists($base_dir . '/.htaccess'),
    'logs_dir_exists' => is_dir($base_dir . '/logs'),
    'logs_dir_writable' => is_writable($base_dir . '/logs'),
];

// ═══════════════════════════════════════════════════════════════════════════
// 5. INFORMACIÓN DE RUTAS
// ═══════════════════════════════════════════════════════════════════════════
$diagnostics['path_info'] = [
    'php_self' => $_SERVER['PHP_SELF'] ?? 'N/A',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'query_string' => $_SERVER['QUERY_STRING'] ?? 'N/A',
    'argv' => $_SERVER['argv'] ?? 'N/A',
    'pwd' => getcwd(),
];

// ═══════════════════════════════════════════════════════════════════════════
// 6. HEADERS RECIBIDOS
// ═══════════════════════════════════════════════════════════════════════════
if (function_exists('getallheaders')) {
    $diagnostics['headers'] = getallheaders();
} else {
    $diagnostics['headers']['error'] = 'getallheaders() no disponible';
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. RECOMENDACIONES
// ═══════════════════════════════════════════════════════════════════════════
$recommendations = [];

// Verificar mod_rewrite
if (!in_array('mod_rewrite', apache_get_modules() ?? [])) {
    $recommendations[] = "⚠️ mod_rewrite no está habilitado. Contacta a Hostinger para habilitarlo.";
}

// Verificar vendor
if (!file_exists($base_dir . '/vendor/autoload.php')) {
    $recommendations[] = "❌ Falta composer packages. Ejecuta 'composer install' localmente y sube la carpeta vendor.";
}

// Verificar .env
if (!file_exists($base_dir . '/.env')) {
    $recommendations[] = "❌ Falta .env. Crear desde .env.example y subir a Hostinger.";
}

// Verificar escritura de logs
if (!is_writable($base_dir . '/logs')) {
    $recommendations[] = "⚠️ La carpeta /logs no es escribible. Cambia permisos a 755 o 775 en Hostinger.";
}

// Verificar extensiones
foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $recommendations[] = "❌ Falta extensión PHP: $ext";
    }
}

// Verificar rutas
if (strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') === false) {
    $recommendations[] = "ℹ️ No estás en la ruta /api/. Asegúrate de acceder a http://tudominio.com/api/diagnostico.php";
}

// Recomendación sobre htaccess
if (file_exists($base_dir . '/.htaccess')) {
    $recommendations[] = "✅ .htaccess existe. Verifica que las reglas RewriteEngine On estén habilitadas.";
} else {
    $recommendations[] = "⚠️ No hay .htaccess. Esto es necesario para reescribir URLs.";
}

$diagnostics['recommendations'] = $recommendations;

// ═══════════════════════════════════════════════════════════════════════════
// SALIDA
// ═══════════════════════════════════════════════════════════════════════════
echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
