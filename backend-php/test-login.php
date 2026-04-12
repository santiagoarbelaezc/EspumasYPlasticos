<?php
/**
 * 🧪 PRUEBA DE LOGIN - Backend PHP
 * Acceso: http://localhost:8000/test-login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;
use App\Utils\Logger;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧪 Prueba de Login - Backend PHP</title>
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
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
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
        
        .response {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            white-space: pre-wrap;
            word-wrap: break-word;
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
        
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            color: #1e40af;
            font-size: 13px;
        }
        
        .test-result {
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
        }
        .test-result.ok {
            background: #f0fdf4;
            border-color: #dcfce7;
        }
        .test-result.error {
            background: #fef2f2;
            border-color: #fecaca;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Prueba de Login</h1>
        <p>Verifica que el endpoint /api/auth/login funciona correctamente</p>
    </div>

    <div class="section">
        <div class="info-box">
            <strong>ℹ️ Información:</strong> Este formulario prueba el login enviando credenciales JSON al backend.
        </div>

        <h2>📝 Formulario de Login</h2>
        
        <div class="form-group">
            <label for="correo">Correo Electrónico:</label>
            <input type="email" id="correo" placeholder="admin@espumasyplasticos.com" value="admin@espumasyplasticos.com">
        </div>

        <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" placeholder="Contraseña">
        </div>

        <div class="button-group">
            <button class="btn-primary" onclick="hacerLogin()">🚀 Enviar Login</button>
        </div>

        <div id="response"></div>
    </div>

    <div class="section">
        <h2>🔍 Estado de Usuarios</h2>
        <div id="statusUsuarios"></div>
    </div>

    <script>
        // Cargar usuarios al abrir la página
        window.addEventListener('load', function() {
            cargarUsuarios();
        });

        function cargarUsuarios() {
            fetch('https://espumasyplasticos.com/api/usuario/listar')
                .then(r => r.json())
                .then(data => {
                    const div = document.getElementById('statusUsuarios');
                    if (data.success && data.data && data.data.length > 0) {
                        let html = '<table style="width: 100%; border-collapse: collapse;">';
                        html += '<tr style="background: #f5f5f5;"><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">ID</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Correo</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Nombre</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Rol</th></tr>';
                        data.data.forEach(u => {
                            html += `<tr><td style="padding: 8px; border: 1px solid #ddd;">${u.id}</td><td style="padding: 8px; border: 1px solid #ddd;">${u.correo}</td><td style="padding: 8px; border: 1px solid #ddd;">${u.nombre || '-'}</td><td style="padding: 8px; border: 1px solid #ddd;">${u.rol}</td></tr>`;
                        });
                        html += '</table>';
                        div.innerHTML = html;
                    } else {
                        div.innerHTML = '<p style="color: #999;">❌ No se pudieron obtener los usuarios</p>';
                    }
                })
                .catch(e => {
                    document.getElementById('statusUsuarios').innerHTML = '<p style="color: #d32f2f;">Error: ' + e.message + '</p>';
                });
        }

        function hacerLogin() {
            const correo = document.getElementById('correo').value.trim();
            const password = document.getElementById('password').value;

            if (!correo || !password) {
                mostrarRespuesta('Por favor completa todos los campos', 'error');
                return;
            }

            console.log('📤 Enviando login a https://espumasyplasticos.com/api/auth/login');
            console.log('Datos:', { correo, password });

            fetch('https://espumasyplasticos.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, password })
            })
            .then(r => {
                console.log('📥 Response status:', r.status, r.statusText);
                return r.json();
            })
            .then(data => {
                console.log('📦 Response data:', data);
                if (data.success) {
                    mostrarRespuesta(
                        '✅ LOGIN EXITOSO\n\nToken: ' + (data.data.token ? data.data.token.substring(0, 50) + '...' : 'No disponible') + 
                        '\n\nDatos del usuario:\n' + JSON.stringify(data.data.usuario, null, 2),
                        'success'
                    );
                } else {
                    mostrarRespuesta('❌ ' + (data.error || 'Error desconocido'), 'error');
                }
            })
            .catch(e => {
                console.error('Fetch error:', e);
                mostrarRespuesta('❌ Error de conexión:\n' + e.message, 'error');
            });
        }

        function mostrarRespuesta(mensaje, tipo) {
            const div = document.getElementById('response');
            div.className = `response ${tipo}`;
            div.textContent = mensaje;
            div.style.display = 'block';
        }
    </script>
</body>
</html>
