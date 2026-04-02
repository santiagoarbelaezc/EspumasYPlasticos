<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use App\Utils\Logger;
use Firebase\JWT\JWT;
use PDO;

class AuthController {
    public static function login(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $correo = trim($data['correo'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($correo) || empty($password)) {
            Response::error('Correo y contraseña son requeridos', 400);
        }

        $correo = strtolower($correo);
        $db = Database::getConnection();
        
        $stmt = $db->prepare('SELECT * FROM usuarios WHERE correo = ?');
        $stmt->execute([$correo]);
        $usuario = $stmt->fetch();

        if (!$usuario) {
            Logger::warning("⚠️  Intento de login fallido: Usuario no encontrado ($correo)");
            Response::error('Usuario no encontrado', 401);
        }

        if (!password_verify($password, $usuario['password'])) {
            Logger::warning("⚠️  Intento de login fallido: Contraseña incorrecta ($correo)");
            Response::error('Contraseña incorrecta', 401);
        }

        $payload = [
            'id' => $usuario['id'],
            'correo' => $usuario['correo'],
            'rol' => $usuario['rol'],
            'iat' => time(),
            'exp' => time() + 3600 // 1 hora
        ];

        $jwt = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        Logger::info("✅ Login exitoso: $correo (ID: " . $usuario['id'] . ")");

        Response::success([
            'mensaje' => 'Login exitoso',
            'token' => $jwt,
            'usuario' => [
                'id' => $usuario['id'],
                'correo' => $usuario['correo'],
                'rol' => $usuario['rol'],
                'nombre' => $usuario['nombre']
            ]
        ]);
    }

    public static function logout(): void {
        Response::success(['mensaje' => 'Logout exitoso (solo frontend)']);
    }

    public static function register(): void {
        Response::error('Funcionalidad no implementada', 501);
    }

    public static function refreshToken(): void {
        Response::error('Funcionalidad no implementada', 501);
    }
}
