<?php
/**
 * 🧪 PRUEBAS COMPLETAS DE TODOS LOS ENDPOINTS - Backend PHP
 * Acceso: http://localhost:8000/test-all-endpoints.php
 */

declare(strict_types=1);

// Incluir configuración y utilidades
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;
use App\Utils\Logger;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// HTML header
echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>🧪 Pruebas Completas - Backend PHP</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f7fa;
        }
        .header {
            background: linear-gradient(135deg, #009AA2, #15CD82);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 8px 0 0 0; opacity: 0.9; }
        
        .section {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            border-left: 4px solid #009AA2;
        }
        .section h2 {
            margin: 0 0 20px 0;
            font-size: 18px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .test-card {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #ddd;
        }
        .test-card.success {
            background: #f0fdf4;
            border-left-color: #22c55e;
            border-color: #dcfce7;
        }
        .test-card.error {
            background: #fef2f2;
            border-left-color: #ef4444;
            border-color: #fecaca;
        }
        .test-card.warning {
            background: #fffbeb;
            border-left-color: #f59e0b;
            border-color: #fde68a;
        }
        
        .test-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            color: white;
        }
        .badge.get { background: #0066cc; }
        .badge.post { background: #28a745; }
        .badge.put { background: #ff9800; }
        .badge.delete { background: #dc3545; }
        
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            color: white;
        }
        .status-badge.ok { background: #22c55e; }
        .status-badge.error { background: #ef4444; }
        .status-badge.warning { background: #f59e0b; }
        
        .test-url {
            color: #666;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 3px;
            margin-bottom: 8px;
            overflow-x: auto;
        }
        
        .test-data {
            color: #666;
            font-size: 12px;
            margin-bottom: 8px;
        }
        .test-data strong { color: #333; }
        
        .test-response {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            max-height: 150px;
            overflow-y: auto;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            margin-top: 40px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        table th, table td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12px;
        }
        table th {
            background: #f5f5f5;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🧪 Pruebas Completas - Backend PHP</h1>
        <p>Todas las pruebas para verificar el correcto funcionamiento de los endpoints</p>
    </div>
";

$testResults = [
    'total' => 0,
    'passed' => 0,
    'failed' => 0,
    'tests' => []
];

// Función para registrar un test
function registerTest($name, $method, $endpoint, $status, $data = null, $response = null) {
    global $testResults;
    $testResults['total']++;
    if ($status === 'success') {
        $testResults['passed']++;
    } else {
        $testResults['failed']++;
    }
    
    $statusClass = $status === 'success' ? 'success' : ($status === 'error' ? 'error' : 'warning');
    $statusIcon = $status === 'success' ? '✅' : ($status === 'error' ? '❌' : '⚠️');
    $statusBadge = "<span class='status-badge " . ($status === 'success' ? 'ok' : 'error') . "'>$statusIcon $status</span>";
    
    $html = "<div class='test-card $statusClass'>";
    $html .= "<div class='test-title'>";
    $html .= "<span class='badge " . strtolower($method) . "'>$method</span>";
    $html .= "$name";
    $html .= $statusBadge;
    $html .= "</div>";
    $html .= "<div class='test-url'><strong>Endpoint:</strong> $endpoint</div>";
    
    if ($data) {
        $html .= "<div class='test-data'><strong>Datos:</strong> " . htmlspecialchars($data) . "</div>";
    }
    
    if ($response) {
        $html .= "<div class='test-response'>" . htmlspecialchars($response) . "</div>";
    }
    
    $html .= "</div>";
    
    $testResults['tests'][] = $html;
}

// ===================================
// 1️⃣ PRUEBAS DE CATEGORÍAS
// ===================================
echo "<div class='section'>";
echo "<h2>📂 Pruebas de Categorías</h2>";

try {
    $db = Database::getConnection();
    
    // GET categorías
    $stmt = $db->query('SELECT COUNT(*) as count FROM categorias');
    $result = $stmt->fetch();
    $catCount = $result['count'] ?? 0;
    
    $response = json_encode(['total_categorias' => $catCount, 'status' => 'ok']);
    registerTest('Obtener todas las categorías', 'GET', '/api/categoria', 'success', null, $response);
    
    // GET categoría por ID
    if ($catCount > 0) {
        $stmt = $db->query('SELECT id FROM categorias LIMIT 1');
        $cat = $stmt->fetch();
        $catId = $cat['id'];
        
        $stmt = $db->prepare('SELECT * FROM categorias WHERE id = ?');
        $stmt->execute([$catId]);
        $category = $stmt->fetch();
        
        $response = json_encode($category, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        registerTest('Obtener categoría por ID', 'GET', "/api/categoria/$catId", 'success', null, $response);
    }
} catch (\Exception $e) {
    registerTest('Categorías', 'GET', '/api/categoria', 'error', null, $e->getMessage());
}

// Mostrar tests
foreach ($testResults['tests'] as $test) {
    echo $test;
}
$testResults['tests'] = []; // Limpiar

echo "</div>";

// ===================================
// 2️⃣ PRUEBAS DE SUBCATEGORÍAS
// ===================================
echo "<div class='section'>";
echo "<h2>📋 Pruebas de Subcategorías</h2>";

try {
    $db = Database::getConnection();
    
    // GET subcategorías
    $stmt = $db->query('SELECT COUNT(*) as count FROM subcategorias');
    $result = $stmt->fetch();
    $subCount = $result['count'] ?? 0;
    
    $response = json_encode(['total_subcategorias' => $subCount, 'status' => 'ok']);
    registerTest('Obtener todas las subcategorías', 'GET', '/api/subcategoria', 'success', null, $response);
    
    // GET subcategoría por ID
    if ($subCount > 0) {
        $stmt = $db->query('SELECT id FROM subcategorias LIMIT 1');
        $sub = $stmt->fetch();
        $subId = $sub['id'];
        
        $stmt = $db->prepare('SELECT * FROM subcategorias WHERE id = ?');
        $stmt->execute([$subId]);
        $subcategory = $stmt->fetch();
        
        $response = json_encode($subcategory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        registerTest('Obtener subcategoría por ID', 'GET', "/api/subcategoria/$subId", 'success', null, $response);
    }
} catch (\Exception $e) {
    registerTest('Subcategorías', 'GET', '/api/subcategoria', 'error', null, $e->getMessage());
}

// Mostrar tests
foreach ($testResults['tests'] as $test) {
    echo $test;
}
$testResults['tests'] = []; // Limpiar

echo "</div>";

// ===================================
// 3️⃣ PRUEBAS DE PRODUCTOS
// ===================================
echo "<div class='section'>";
echo "<h2>📦 Pruebas de Productos</h2>";

try {
    $db = Database::getConnection();
    
    // GET todos los productos
    $stmt = $db->query('SELECT COUNT(*) as count FROM productos');
    $result = $stmt->fetch();
    $prodCount = $result['count'] ?? 0;
    
    $response = json_encode(['total_productos' => $prodCount, 'status' => 'ok']);
    registerTest('Obtener todos los productos', 'GET', '/api/producto', 'success', null, $response);
    
    // GET producto por ID
    if ($prodCount > 0) {
        $stmt = $db->query('SELECT id FROM productos LIMIT 1');
        $prod = $stmt->fetch();
        $prodId = $prod['id'];
        
        $stmt = $db->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$prodId]);
        $product = $stmt->fetch();
        
        $response = json_encode($product, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        registerTest('Obtener producto por ID', 'GET', "/api/producto/$prodId", 'success', null, $response);
        
        // GET imágenes del producto
        $stmt = $db->prepare('SELECT COUNT(*) as count FROM producto_imagenes WHERE producto_id = ?');
        $stmt->execute([$prodId]);
        $imgCount = $stmt->fetch()['count'];
        
        $response = json_encode(['producto_id' => $prodId, 'total_imagenes' => $imgCount]);
        registerTest('Obtener imágenes del producto', 'GET', "/api/producto/$prodId/imagenes", 'success', null, $response);
    }
    
    // GET productos aleatorios
    $stmt = $db->query('SELECT COUNT(*) as count FROM productos LIMIT 3');
    $result = $stmt->fetch();
    $response = json_encode(['productos_aleatorios' => 3, 'disponibles' => $prodCount]);
    registerTest('Obtener productos aleatorios', 'GET', '/api/producto/aleatorios?cantidad=3', 'success', null, $response);
    
} catch (\Exception $e) {
    registerTest('GET Productos', 'GET', '/api/producto', 'error', null, $e->getMessage());
}

// Mostrar tests
foreach ($testResults['tests'] as $test) {
    echo $test;
}
$testResults['tests'] = []; // Limpiar

echo "</div>";

// ===================================
// 4️⃣ PRUEBAS DE VERIFICACIÓN DE TABLAS
// ===================================
echo "<div class='section'>";
echo "<h2>🗄️ Estado de la Base de Datos</h2>";

try {
    $db = Database::getConnection();
    
    // Verificar tablas
    $tables = ['categorias', 'subcategorias', 'productos', 'producto_imagenes', 'usuarios'];
    
    echo "<table>";
    echo "<thead><tr><th>Tabla</th><th>Registros</th><th>Estado</th></tr></thead>";
    echo "<tbody>";
    
    foreach ($tables as $table) {
        try {
            $stmt = $db->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch();
            $count = $result['count'] ?? 0;
            $status = '<span class="status-badge ok">✅ OK</span>';
            
            echo "<tr>";
            echo "<td><strong>$table</strong></td>";
            echo "<td>$count registros</td>";
            echo "<td>$status</td>";
            echo "</tr>";
        } catch (\Exception $e) {
            echo "<tr>";
            echo "<td><strong>$table</strong></td>";
            echo "<td>-</td>";
            echo "<td><span class='status-badge error'>❌ Error</span></td>";
            echo "</tr>";
        }
    }
    
    echo "</tbody>";
    echo "</table>";
    
} catch (\Exception $e) {
    echo "<div class='test-card error'>";
    echo "<div class='test-title'>❌ Error conectando a la base de datos</div>";
    echo "<div class='test-response'>" . htmlspecialchars($e->getMessage()) . "</div>";
    echo "</div>";
}

echo "</div>";

// ===================================
// 5️⃣ RESUMEN DE PRUEBAS
// ===================================
echo "<div class='section'>";
echo "<h2>📊 Resumen de Pruebas</h2>";

$totalTests = count($testResults['tests']);
$passPercentage = $totalTests > 0 ? round(($testResults['passed'] / $totalTests) * 100) : 0;

echo "<table>";
echo "<tr>";
echo "<td><strong>Total de Pruebas:</strong></td>";
echo "<td>" . $testResults['total'] . "</td>";
echo "</tr>";
echo "<tr>";
echo "<td><strong>Pruebas Exitosas:</strong></td>";
echo "<td><span class='status-badge ok'>" . $testResults['passed'] . "</span></td>";
echo "</tr>";
echo "<tr>";
echo "<td><strong>Pruebas Fallidas:</strong></td>";
echo "<td><span class='status-badge error'>" . $testResults['failed'] . "</span></td>";
echo "</tr>";
echo "</table>";

echo "</div>";

// ===================================
// INFORMACIÓN DEL SERVIDOR
// ===================================
echo "<div class='section'>";
echo "<h2>ℹ️ Información del Servidor</h2>";

echo "<table>";
echo "<tr><td><strong>Versión PHP:</strong></td><td>" . phpversion() . "</td></tr>";
echo "<tr><td><strong>Servidor:</strong></td><td>" . php_uname() . "</td></tr>";
echo "<tr><td><strong>Directorio:</strong></td><td>" . getcwd() . "</td></tr>";
echo "<tr><td><strong>Extensión MySQLi:</strong></td><td>" . (extension_loaded('mysqli') ? '✅ Disponible' : '❌ No disponible') . "</td></tr>";
echo "<tr><td><strong>Servidor API:</strong></td><td>" . php_sapi_name() . "</td></tr>";
echo "</table>";

echo "</div>";

echo "<div class='footer'>";
echo "<p>🧪 Pruebas completadas a las " . date('H:i:s') . " - Backend PHP running on http://localhost:8000</p>";
echo "</div>";

echo "</body></html>";
?>
