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
        // En JSON POST, usar Request::all() para parsear correctamente en Hostinger
        $data = \App\Utils\Request::all();
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
        // En JSON POST, usar Request::all() para parsear correctamente en Hostinger
        $data = \App\Utils\Request::all();
        
        $nombre = trim($data['nombre'] ?? '');
        $correo = trim($data['correo'] ?? '');
        $password = $data['password'] ?? '';
        $rol = $data['rol'] ?? 'user';
        $estado = $data['estado'] ?? 'activo';

        if (empty($nombre) || empty($correo) || empty($password)) {
            Response::error('Nombre, correo y contraseña son requeridos', 400);
        }

        $correo = strtolower($correo);
        $db = Database::getConnection();

        // Verificar si el correo ya existe
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE correo = ?');
        $stmt->execute([$correo]);
        if ($stmt->fetch()) {
            Response::error('El correo ya está registrado', 400);
        }

        try {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            
            $stmt = $db->prepare('INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$nombre, $correo, $hashedPassword, $rol, $estado]);

            Logger::info("👤 Nuevo usuario registrado: $correo ($rol)");

            Response::success([
                'mensaje' => 'Usuario registrado exitosamente',
                'id' => $db->lastInsertId()
            ], 201);

        } catch (\PDOException $e) {
            Logger::error("❌ Error al registrar usuario: " . $e->getMessage());
            Response::error('Error al registrar el usuario en la base de datos', 500);
        }
    }

    public static function refreshToken(): void {
        Response::error('Funcionalidad no implementada', 501);
    }
}
