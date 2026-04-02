<?php

declare(strict_types=1);

namespace App\Config;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use App\Utils\Logger;

require_once __DIR__ . '/../vendor/autoload.php';

class CloudinaryConfig {
    private static ?Cloudinary $instance = null;

    public static function getInstance(): Cloudinary {
        if (self::$instance === null) {
            $config = Configuration::instance();
            $config->cloud->cloudName = $_ENV['CLOUDINARY_CLOUD_NAME'] ?? '';
            $config->cloud->apiKey = $_ENV['CLOUDINARY_API_KEY'] ?? '';
            $config->cloud->apiSecret = $_ENV['CLOUDINARY_API_SECRET'] ?? '';
            $config->url->secure = true;

            Logger::info("☁️  Inicializando Cloudinary...");
            self::$instance = new Cloudinary($config);
        }
        return self::$instance;
    }

    /**
     * Sube un archivo a Cloudinary
     */
    public static function upload(string $filePath, string $folder = 'espumas_plasticos_general'): array {
        Logger::info("📸 Iniciando subida a Cloudinary en carpeta: $folder...");
        $cloudinary = self::getInstance();
        $result = $cloudinary->uploadApi()->upload($filePath, [
            'folder' => $folder,
            'resource_type' => 'auto',
            'transformation' => [
                ['width' => 800, 'height' => 600, 'crop' => 'limit']
            ]
        ]);

        Logger::info("✅ Subida completada: " . ($result['public_id'] ?? 'N/A'));
        return [
            'secure_url' => $result['secure_url'],
            'public_id' => $result['public_id']
        ];
    }

    /**
     * Elimina un archivo de Cloudinary
     */
    public static function delete(string $publicId): bool {
        try {
            Logger::info("🗑️  Eliminando de Cloudinary: $publicId...");
            $cloudinary = self::getInstance();
            $result = $cloudinary->uploadApi()->destroy($publicId);
            $success = ($result['result'] ?? '') === 'ok';

            if ($success) {
                Logger::info("✅ Eliminación exitosa");
            } else {
                Logger::warning("⚠️  Eliminación fallida para $publicId: " . json_encode($result));
            }

            return $success;
        } catch (\Exception $e) {
            Logger::error("❌ Error eliminando de Cloudinary: " . $e->getMessage());
            return false;
        }
    }
}
