<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\CloudinaryConfig;
use App\Utils\Response;

class UploadMiddleware {
    /**
     * Maneja la subida de una sola imagen (por ejemplo, para iconos de categoría)
     */
    public static function handleSingleUpload(string $fieldName, string $folder = 'espumas_plasticos_general'): ?array {
        $files = \App\Utils\Request::files();
        
        if (!isset($files[$fieldName]) || $files[$fieldName]['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $file = $files[$fieldName];
        $validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        // El tipo puede venir en 'type' o lo extraemos de la extensión si fallamos
        if (!in_array($file['type'], $validTypes)) {
            Response::error('Formato de imagen no permitido. Solo JPEG, PNG, JPG, WEBP', 400);
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('El archivo es demasiado grande (máximo 5MB)', 400);
        }

        try {
            $result = CloudinaryConfig::upload($file['tmp_name'], $folder);
            
            // Si es un archivo temporal de PUT (nuestro prefijo), lo borramos
            if (strpos($file['tmp_name'], 'php_put_upload_') !== false) {
                @unlink($file['tmp_name']);
            }
            
            return $result;
        } catch (\Exception $e) {
            Response::error('Error subiendo imagen a Cloudinary', 500, $e->getMessage());
        }

        return null;
    }

    /**
     * Maneja la subida de múltiples imágenes (para productos)
     */
    public static function handleMultipleUpload(string $fieldName, string $folder = 'espumas_plasticos_productos', int $limit = 5): array {
        $filesSource = \App\Utils\Request::files();
        
        \App\Utils\Logger::info("🔍 Buscando campo de imágenes: $fieldName en " . json_encode(array_keys($filesSource)));
        
        if (!isset($filesSource[$fieldName])) {
            \App\Utils\Logger::warning("⚠️  Campo '$fieldName' no encontrado en FILES");
            return [];
        }
        
        $files = $filesSource[$fieldName];

        // Normalizar: Si es un solo archivo (no es array), lo convertimos en la misma estructura de array
        if (!is_array($files['name'])) {
            \App\Utils\Logger::info("💡 Campo '$fieldName' detectado como archivo único. Normalizando a lista...");
            $files = [
                'name' => [$files['name']],
                'type' => [$files['type']],
                'tmp_name' => [$files['tmp_name']],
                'error' => [$files['error']],
                'size' => [$files['size']]
            ];
        }
        $results = [];
        $count = min(count($files['name']), $limit);
        
        \App\Utils\Logger::info("📥 Procesando $count archivo(s) de imágenes...");

        for ($i = 0; $i < $count; $i++) {
            $errorCode = $files['error'][$i];
            $tmpPath = $files['tmp_name'][$i];
            $fileName = $files['name'][$i];
            $type = $files['type'][$i];
            $size = $files['size'][$i];
            
            \App\Utils\Logger::debug("🖼️  Archivo $i: $fileName | Error: $errorCode | Type: $type | Size: $size bytes");
            
            if ($errorCode !== UPLOAD_ERR_OK) {
                \App\Utils\Logger::warning("⚠️  Error en upload del archivo $fileName: código $errorCode");
                continue;
            }

            $validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!in_array($type, $validTypes)) {
                \App\Utils\Logger::warning("⚠️  Tipo de archivo inválido: $type para $fileName");
                continue;
            }
            
            if ($size > 5 * 1024 * 1024) {
                \App\Utils\Logger::warning("⚠️  Archivo demasiado grande: $size bytes para $fileName");
                continue;
            }

            try {
                \App\Utils\Logger::info("⏳ Subiendo a Cloudinary: $fileName...");
                $result = CloudinaryConfig::upload($tmpPath, $folder);
                $results[] = $result;
                \App\Utils\Logger::info("✅ Archivo $fileName subido exitosamente");
                
                // Limpieza de temporales PUT
                if (strpos($tmpPath, 'php_put_upload_') !== false) {
                    @unlink($tmpPath);
                }
            } catch (\Exception $e) {
                \App\Utils\Logger::error("❌ Error subiendo imagen '$fileName' a Cloudinary: " . $e->getMessage());
                continue;
            }
        }
        
        \App\Utils\Logger::info("📦 Total de imágenes subidas correctamente: " . count($results));
        return $results;
    }
}
