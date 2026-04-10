<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Database;

header('Content-Type: text/plain; charset=utf-8');

echo "=== Inicializador de Base de Datos ===\n\n";

try {
    $pdo = Database::getConnection();
    echo "✅ Conexión establecida.\n";

    $queries = [
        "CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            correo VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            rol VARCHAR(50) NOT NULL DEFAULT 'user',
            estado VARCHAR(20) NOT NULL DEFAULT 'activo',
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

        "CREATE TABLE IF NOT EXISTS categorias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

        "CREATE TABLE IF NOT EXISTS subcategorias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            categoria_id INT NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",

        "CREATE TABLE IF NOT EXISTS productos (
            id INT NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            descripcion TEXT,
            material VARCHAR(100),
            category VARCHAR(100),
            options TEXT,
            isNew TINYINT(1) DEFAULT 0,
            isFeatured TINYINT(1) DEFAULT 0,
            marca VARCHAR(100),
            gramaje VARCHAR(100),
            brandIconUrl VARCHAR(255),
            subcategoria_id INT,
            precio DECIMAL(12, 2) DEFAULT 0,
            cantidad INT DEFAULT 0,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id),
            KEY idx_nombre (nombre),
            KEY idx_subcategoria (subcategoria_id),
            FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS producto_imagenes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            producto_id INT NOT NULL,
            imagen_url VARCHAR(500) NOT NULL,
            public_id VARCHAR(200) NULL DEFAULT NULL,
            orden INT NOT NULL DEFAULT 0,
            description TEXT,
            UNIQUE KEY uk_public_id (public_id),
            KEY idx_producto (producto_id),
            KEY idx_orden (orden),
            FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS producto_variantes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            producto_id INT NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            disponible TINYINT(1) DEFAULT 1,
            precio DECIMAL(10, 2) DEFAULT 0.00,
            KEY producto_id (producto_id),
            FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "CREATE TABLE IF NOT EXISTS producto_colores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            producto_id INT NOT NULL,
            color VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_producto (producto_id),
            FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
    ];

    foreach ($queries as $sql) {
        $tableName = '';
        if (preg_match('/CREATE TABLE IF NOT EXISTS (\w+)/', $sql, $matches)) {
            $tableName = $matches[1];
        }
        
        echo "⏳ Creando tabla '$tableName'...";
        $pdo->exec($sql);
        echo " ✅ OK\n";
    }

    echo "\n🚀 ¡Todas las tablas base han sido creadas exitosamente!\n";

} catch (Exception $e) {
    echo "\n❌ Error durante la inicialización: " . $e->getMessage() . "\n";
}

echo "\n======================================\n";
