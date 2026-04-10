<?php
/**
 * 🧪 PRUEBA DE ACTUALIZACIÓN PUT CON FORMDATA
 * Acceso: http://localhost:8000/test-put-update.php
 */

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;
use App\Utils\Logger;

// Cargar variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧪 Prueba PUT Update - Backend PHP</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
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
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-primary {
            background: #009AA2;
            color: white;
        }
        .btn-primary:hover {
            background: #007a86;
        }
        .btn-secondary {
            background: #667eea;
            color: white;
        }
        .btn-secondary:hover {
            background: #5568d3;
        }
        
        .response {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            max-height: 300px;
            overflow-y: auto;
        }
        .response.success {
            background: #f0fdf4;
            border-color: #dcfce7;
            color: #166534;
        }
        .response.error {
            background: #fef2f2;
            border-color: #fecaca;
            color: #991b1b;
        }
        .response.warning {
            background: #fffbeb;
            border-color: #fde68a;
            color: #92400e;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            margin-right: 10px;
        }
        .status-badge.ok { background: #22c55e; }
        .status-badge.error { background: #ef4444; }
        
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            color: #1e40af;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Prueba de Actualización PUT con FormData</h1>
        <p>Verifica que los datos se reciben correctamente en el backend PHP</p>
    </div>

    <div class="section">
        <div class="info-box">
            <strong>ℹ️ Información:</strong> Este formulario simula una actualización de producto con datos FormData.
            Los datos se envían vía PUT y deben llegar correctamente al controlador.
        </div>

        <h2>📦 Seleccionar Producto para Actualizar</h2>
        
        <div class="form-group">
            <label for="productoId">ID del Producto:</label>
            <select id="productoId" onchange="cargarProducto()">
                <option value="">-- Selecciona un producto --</option>
                <?php
                try {
                    $db = Database::getConnection();
                    $stmt = $db->query('SELECT id, nombre FROM productos LIMIT 10');
                    $productos = $stmt->fetchAll();
                    foreach ($productos as $prod) {
                        echo "<option value='{$prod['id']}'>{$prod['id']} - {$prod['nombre']}</option>";
                    }
                } catch (\Exception $e) {
                    echo "<option>Error cargando productos</option>";
                }
                ?>
            </select>
        </div>

        <form id="updateForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
            </div>

            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion"></textarea>
            </div>

            <div class="form-group">
                <label for="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" value="0" required>
            </div>

            <div class="form-group">
                <label for="precio">Precio:</label>
                <input type="number" id="precio" name="precio" step="0.01" value="0" required>
            </div>

            <div class="form-group">
                <label for="subcategoria_id">Subcategoría:</label>
                <select id="subcategoria_id" name="subcategoria_id" required>
                    <option value="">-- Selecciona una subcategoría --</option>
                    <?php
                    try {
                        $db = Database::getConnection();
                        $stmt = $db->query('SELECT id, nombre FROM subcategorias LIMIT 20');
                        $subcategorias = $stmt->fetchAll();
                        foreach ($subcategorias as $sub) {
                            echo "<option value='{$sub['id']}'>{$sub['nombre']}</option>";
                        }
                    } catch (\Exception $e) {
                        echo "<option>Error cargando subcategorías</option>";
                    }
                    ?>
                </select>
            </div>

            <div class="form-group">
                <label for="imagenes">Nuevas Imágenes (opcional):</label>
                <input type="file" id="imagenes" name="imagenes" accept="image/*" multiple>
                <small>Deja vacío para mantener las imágenes actuales</small>
            </div>

            <div class="button-group">
                <button type="button" class="btn-primary" onclick="actualizarProducto()">🚀 Actualizar Producto (PUT)</button>
                <button type="button" class="btn-secondary" onclick="limpiarFormulario()">🔄 Limpiar</button>
            </div>
        </form>

        <div id="response"></div>
    </div>

    <script>
        function cargarProducto() {
            const id = document.getElementById('productoId').value;
            if (!id) {
                document.getElementById('nombre').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('cantidad').value = '0';
                document.getElementById('precio').value = '0';
                return;
            }

            fetch(`http://localhost:8000/api/producto/${id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.data) {
                        const prod = data.data;
                        document.getElementById('nombre').value = prod.nombre || '';
                        document.getElementById('descripcion').value = prod.descripcion || '';
                        document.getElementById('cantidad').value = prod.cantidad || '0';
                        document.getElementById('precio').value = prod.precio || '0';
                        document.getElementById('subcategoria_id').value = prod.subcategoria_id || '';
                    }
                })
                .catch(e => console.error('Error:', e));
        }

        function actualizarProducto() {
            const id = document.getElementById('productoId').value;
            if (!id) {
                mostrarRespuesta('Debes seleccionar un producto', 'error');
                return;
            }

            const formData = new FormData(document.getElementById('updateForm'));
            
            console.log('📤 Enviando PUT request con datos:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value instanceof File ? `${value.name} (${value.size} bytes)` : value}`);
            }

            fetch(`http://localhost:8000/api/producto/${id}`, {
                method: 'PUT',
                body: formData
            })
            .then(r => {
                console.log('📥 Response status:', r.status);
                return r.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarRespuesta(`✅ ${data.data.mensaje}`, 'success');
                } else {
                    mostrarRespuesta(`❌ ${data.error || 'Error desconocido'}`, 'error');
                }
                console.log('Response:', data);
            })
            .catch(e => {
                console.error('Fetch error:', e);
                mostrarRespuesta(`❌ Error de conexión: ${e.message}`, 'error');
            });
        }

        function limpiarFormulario() {
            document.getElementById('updateForm').reset();
            document.getElementById('productoId').value = '';
            document.getElementById('response').innerHTML = '';
        }

        function mostrarRespuesta(mensaje, tipo) {
            const div = document.getElementById('response');
            div.className = `response ${tipo}`;
            div.innerHTML = `<strong>${tipo === 'success' ? '✅ Éxito' : '❌ Error'}:</strong><br>${mensaje}`;
        }
    </script>
</body>
</html>
