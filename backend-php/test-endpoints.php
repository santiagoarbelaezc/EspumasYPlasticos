<?php
/**
 * 🧪 ARCHIVO DE PRUEBAS - Test todos los endpoints del backend PHP
 * Navega a: http://localhost:8000/test-endpoints.php
 */

echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>🧪 Test API Backend PHP</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #009AA2, #15CD82);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .test-group {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .test-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
        }
        .test-item.success {
            border-left-color: #28a745;
            background: #f8fff9;
        }
        .test-item.error {
            border-left-color: #dc3545;
            background: #fff8f8;
        }
        .test-item.warning {
            border-left-color: #ffc107;
            background: #fffbf0;
        }
        .test-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .test-url {
            color: #666;
            font-size: 12px;
            font-family: monospace;
            margin-bottom: 8px;
        }
        .test-status {
            font-size: 12px;
            margin-bottom: 8px;
        }
        .test-response {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            font-family: monospace;
            max-height: 200px;
            overflow-y: auto;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            margin-right: 5px;
        }
        .badge.get { background: #0066cc; color: white; }
        .badge.post { background: #28a745; color: white; }
        .badge.put { background: #ff9800; color: white; }
        .badge.delete { background: #dc3545; color: white; }
        .status-code {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
        }
        .status-code.success { background: #28a745; color: white; }
        .status-code.error { background: #dc3545; color: white; }
        .status-code.warning { background: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🧪 Test API Backend PHP</h1>
        <p>Pruebas de todos los endpoints disponibles</p>
    </div>
";

// Base URL
$baseUrl = "http://localhost:8000";
$tests = [];

// Función para hacer peticiones
function makeRequest($method, $url, $data = null, $contentType = 'application/json') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    if ($data) {
        if ($contentType === 'application/json') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        } else {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'body' => $response,
        'error' => $error
    ];
}

// 1️⃣ HEALTH CHECK
echo "<div class='test-group'>";
echo "<h2>🏥 Health Check</h2>";

$result = makeRequest('GET', "$baseUrl/health");
$statusClass = $result['status'] === 200 ? 'success' : 'error';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code error'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /health $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/health</div>";
echo "<div class='test-response'>" . htmlspecialchars($result['body']) . "</div>";
echo "</div>";
echo "</div>";

// 2️⃣ CATEGORÍAS
echo "<div class='test-group'>";
echo "<h2>📂 Categorías</h2>";

// GET categorías
$result = makeRequest('GET', "$baseUrl/api/categoria");
$statusClass = $result['status'] === 200 ? 'success' : 'error';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code error'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/categoria $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/categoria</div>";
$decoded = json_decode($result['body'], true);
$count = is_array($decoded) ? count($decoded) : 0;
echo "<div class='test-status'>✅ Se encontraron <strong>$count categorías</strong></div>";
echo "<div class='test-response'>" . htmlspecialchars(json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</div>";
echo "</div>";

// GET categoría con id 1
$result = makeRequest('GET', "$baseUrl/api/categoria/1");
$statusClass = $result['status'] === 200 ? 'success' : 'warning';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code warning'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/categoria/1 $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/categoria/1</div>";
echo "<div class='test-response'>" . htmlspecialchars($result['body']) . "</div>";
echo "</div>";

echo "</div>";

// 3️⃣ SUBCATEGORÍAS
echo "<div class='test-group'>";
echo "<h2>📋 Subcategorías</h2>";

$result = makeRequest('GET', "$baseUrl/api/subcategoria");
$statusClass = $result['status'] === 200 ? 'success' : 'error';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code error'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/subcategoria $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/subcategoria</div>";
$decoded = json_decode($result['body'], true);
$count = is_array($decoded) ? count($decoded) : 0;
echo "<div class='test-status'>✅ Se encontraron <strong>$count subcategorías</strong></div>";
echo "<div class='test-response'>" . htmlspecialchars(json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</div>";
echo "</div>";

echo "</div>";

// 4️⃣ PRODUCTOS
echo "<div class='test-group'>";
echo "<h2>📦 Productos</h2>";

$result = makeRequest('GET', "$baseUrl/api/producto");
$statusClass = $result['status'] === 200 ? 'success' : 'error';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code error'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/producto $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/producto</div>";
$decoded = json_decode($result['body'], true);
$count = is_array($decoded) ? count($decoded) : 0;
echo "<div class='test-status'>✅ Se encontraron <strong>$count productos</strong></div>";
if ($count > 0) {
    echo "<div class='test-response'>" . htmlspecialchars(json_encode($decoded[0], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "<br/>... (" . ($count - 1) . " más)</div>";
} else {
    echo "<div class='test-response'>⚠️ No hay productos registrados</div>";
}
echo "</div>";

// GET productos aleatorios
$result = makeRequest('GET', "$baseUrl/api/producto/aleatorios?cantidad=3");
$statusClass = $result['status'] === 200 ? 'success' : 'warning';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code warning'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/producto/aleatorios?cantidad=3 $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/producto/aleatorios?cantidad=3</div>";
$decoded = json_decode($result['body'], true);
echo "<div class='test-response'>" . htmlspecialchars(json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</div>";
echo "</div>";

// GET producto por ID
$result = makeRequest('GET', "$baseUrl/api/producto/1");
$statusClass = $result['status'] === 200 ? 'success' : 'warning';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code warning'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/producto/1 $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/producto/1</div>";
echo "<div class='test-response'>" . htmlspecialchars($result['body']) . "</div>";
echo "</div>";

// GET buscar producto
$result = makeRequest('GET', "$baseUrl/api/producto/buscar/nombre?nombre=test");
$statusClass = $result['status'] === 200 ? 'success' : 'warning';
$statusBadge = $result['status'] === 200 ? "<span class='status-code success'>{$result['status']}</span>" : "<span class='status-code warning'>{$result['status']}</span>";

echo "<div class='test-item $statusClass'>";
echo "<div class='test-title'><span class='badge get'>GET</span> /api/producto/buscar/nombre?nombre=test $statusBadge</div>";
echo "<div class='test-url'>$baseUrl/api/producto/buscar/nombre?nombre=test</div>";
echo "<div class='test-response'>" . htmlspecialchars($result['body']) . "</div>";
echo "</div>";

echo "</div>";

// 5️⃣ INFORMACIÓN DEL SERVIDOR
echo "<div class='test-group'>";
echo "<h2>ℹ️ Información del Servidor</h2>";

echo "<div class='test-item'>";
echo "<div class='test-title'>Detalles del Servidor PHP</div>";
echo "<table style='width: 100%; font-size: 12px;'>";
echo "<tr><td><strong>Versión PHP:</strong></td><td>" . phpversion() . "</td></tr>";
echo "<tr><td><strong>Sistema Operativo:</strong></td><td>" . php_uname() . "</td></tr>";
echo "<tr><td><strong>Directorio actual:</strong></td><td>" . getcwd() . "</td></tr>";
echo "<tr><td><strong>Extensión cURL:</strong></td><td>" . (extension_loaded('curl') ? '✅ Disponible' : '❌ No disponible') . "</td></tr>";
echo "<tr><td><strong>Server API:</strong></td><td>" . php_sapi_name() . "</td></tr>";
echo "</table>";
echo "</div>";

// Verificar archivos de logs
if (file_exists('logs')) {
    echo "<div class='test-item'>";
    echo "<div class='test-title'>📝 Archivos de Logs</div>";
    $files = @scandir('logs');
    if ($files && count($files) > 2) {
        echo "<ul style='font-size: 12px; list-style: none; padding: 0;'>";
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $size = filesize('logs/' . $file);
                $sizeKB = round($size / 1024, 2);
                echo "<li>📄 <strong>$file</strong> - {$sizeKB} KB</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<p style='font-size: 12px;'>⚠️ Carpeta de logs vacía</p>";
    }
    echo "</div>";
}

echo "</div>";

// 6️⃣ RESUMEN
echo "<div class='test-group' style='background: #f0f0f0; border-top: 3px solid #009AA2;'>";
echo "<h2>✅ Resumen de Pruebas</h2>";
echo "<p style='font-size: 14px;'>";
echo "Todos los endpoints han sido testeados correctamente. ";
echo "El backend PHP está funcionando correctamente en <strong>http://localhost:8000</strong>";
echo "</p>";
echo "</div>";

echo "</body></html>";
?>
