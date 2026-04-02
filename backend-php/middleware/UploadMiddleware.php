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
        if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $file = $_FILES[$fieldName];
        $validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        if (!in_array($file['type'], $validTypes)) {
            Response::error('Formato de imagen no permitido. Solo JPEG, PNG, JPG, WEBP', 400);
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('El archivo es demasiado grande (máximo 5MB)', 400);
        }

        try {
            return CloudinaryConfig::upload($file['tmp_name'], $folder);
        } catch (\Exception $e) {
            Response::error('Error subiendo imagen a Cloudinary', 500, $e->getMessage());
        }

        return null;
    }

    /**
     * Maneja la subida de múltiples imágenes (para productos)
     */
    public static function handleMultipleUpload(string $fieldName, string $folder = 'espumas_plasticos_productos', int $limit = 5): array {
        if (!isset($_FILES[$fieldName]) || !is_array($_FILES[$fieldName]['name'])) {
            return [];
        }

        $files = $_FILES[$fieldName];
        $results = [];
        $count = min(count($files['name']), $limit);

        for ($i = 0; $i < $count; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;

            $tmpPath = $files['tmp_name'][$i];
            $type = $files['type'][$i];
            $size = $files['size'][$i];

            $validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!in_array($type, $validTypes)) continue;
            if ($size > 5 * 1024 * 1024) continue;

            try {
                $results[] = CloudinaryConfig::upload($tmpPath, $folder);
            } catch (\Exception $e) {
                // Si falla uno, continuamos con los demás o lanzamos error?
                // En Node.js parece que fallaba todo si uno fallaba (Promise.all)
                Response::error('Error subiendo imágenes a Cloudinary', 500, $e->getMessage());
            }
        }

        return $results;
    }
}
