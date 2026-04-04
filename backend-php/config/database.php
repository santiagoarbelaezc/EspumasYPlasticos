<?php

declare(strict_types=1);

namespace App\Config;

use PDO;
use PDOException;
use Dotenv\Dotenv;
use App\Utils\Logger;

require_once __DIR__ . '/../vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            self::$instance = self::createConnection('DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD');
        }
        return self::$instance;
    }

    private static ?PDO $hostingerInstance = null;

    public static function getHostingerConnection(): PDO {
        if (self::$hostingerInstance === null) {
            self::$hostingerInstance = self::createConnection(
                'HOSTINGER_DB_HOST', 
                'HOSTINGER_DB_PORT', 
                'HOSTINGER_DB_NAME', 
                'HOSTINGER_DB_USER', 
                'HOSTINGER_DB_PASSWORD'
            );
        }
        return self::$hostingerInstance;
    }

    private static function createConnection(string $h, string $p, string $n, string $u, string $passKey): PDO {
        $host = $_ENV[$h] ?? 'localhost';
        $port = $_ENV[$p] ?? '3306';
        $db   = $_ENV[$n] ?? '';
        $user = $_ENV[$u] ?? '';
        $pass = $_ENV[$passKey] ?? '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            Logger::info("🔄 Intentando conectar a la base de datos [$n]: $host:$port/$db");
            return new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            Logger::error("❌ Error de conexión a la base de datos [$n]: " . $e->getMessage());
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'error' => "Error de conexión a la base de datos [$n]",
                'details' => $e->getMessage()
            ]);
            exit;
        }
    }
}
