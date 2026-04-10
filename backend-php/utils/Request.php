<?php

declare(strict_types=1);

namespace App\Utils;

class Request {
    /**
     * Obtiene todos los parámetros de la petición (JSON o POST)
     */
    public static function all(): array {
        $method = $_SERVER['REQUEST_METHOD'];
        $data = [];

        // 1. Siempre incluir lo que haya en $_POST (si el servidor lo procesó - sucede en POST/Spoofing)
        $data = array_merge($data, $_POST);

        // 2. Si hay raw body, intentar procesarlo
        $rawInput = file_get_contents('php://input');
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

        if (!empty($rawInput) && stripos($contentType, 'application/json') !== false) {
            $decoded = json_decode($rawInput, true);
            if (is_array($decoded)) {
                $data = array_merge($data, $decoded);
            }
        } elseif ($method === 'PUT' && !empty($rawInput)) {
            // Manejo especial para PUT en PHP (no puebla $_POST automáticamente)
            if (stripos($contentType, 'application/x-www-form-urlencoded') !== false) {
                parse_str($rawInput, $putData);
                $data = array_merge($data, $putData);
            } elseif (stripos($contentType, 'multipart/form-data') !== false) {
                // Parseo manual de multipart/form-data para PUT
                self::parseMultipart($rawInput, $contentType, $data);
            }
        }
        
        return $data;
    }

    private static ?array $cachedFiles = null;

    /**
     * Obtiene los archivos de la petición (soporta $_FILES y PUT manual)
     */
    public static function files(): array {
        if (self::$cachedFiles !== null) return self::$cachedFiles;
        
        $files = $_FILES; // Lo que PHP ya procesó (en POST)
        
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = [];
            $rawInput = file_get_contents('php://input');
            $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
            
            if (stripos($contentType, 'multipart/form-data') !== false) {
                $manualFiles = [];
                self::parseMultipart($rawInput, $contentType, $unused, $manualFiles);
                $files = array_merge($files, $manualFiles);
            }
        }
        
        self::$cachedFiles = $files;
        return $files;
    }

    /**
     * Parseador de multipart para peticiones PUT (campos y archivos)
     */
    private static function parseMultipart(string $rawInput, string $contentType, ?array &$data = [], array &$files = []): void {
        if (!preg_match('/boundary=(.*)$/i', $contentType, $matches)) return;
        $boundary = $matches[1];
        
        // El boundary puede venir con comillas o espacios extra
        $boundary = trim($boundary, '" ');
        
        $blocks = explode("--" . $boundary, $rawInput);
        
        foreach ($blocks as $block) {
            if (empty(trim($block)) || $block === "--\r\n" || $block === "--") continue;

            // Separar headers y body
            $parts = explode("\r\n\r\n", $block, 2);
            if (count($parts) < 2) continue;
            
            $headers = $parts[0];
            $body = substr($parts[1], 0, -2); // Quitar el \r\n final del bloque

            // Extraer nombre del campo
            if (preg_match('/name=\"([^\"]*)\"/', $headers, $nameMatch)) {
                $fieldName = $nameMatch[1];
                
                // ¿Es un archivo?
                if (preg_match('/filename=\"([^\"]*)\"/', $headers, $fileMatch)) {
                    $fileName = $fileMatch[1];
                    preg_match('/Content-Type:\s+([^\r\n]*)/i', $headers, $typeMatch);
                    $fileType = $typeMatch[1] ?? 'application/octet-stream';
                    
                    // Guardar a archivo temporal
                    $tmpPath = tempnam(sys_get_temp_dir(), 'php_put_upload_');
                    file_put_contents($tmpPath, $body);
                    
                    // Estructura compatible con $_FILES
                    // Soporte simple para array de archivos (ej: imagenes[])
                    if (strpos($fieldName, '[]') !== false) {
                        $baseName = str_replace('[]', '', $fieldName);
                        if (!isset($files[$baseName])) {
                            $files[$baseName] = ['name' => [], 'type' => [], 'tmp_name' => [], 'error' => [], 'size' => []];
                        }
                        $files[$baseName]['name'][] = $fileName;
                        $files[$baseName]['type'][] = $fileType;
                        $files[$baseName]['tmp_name'][] = $tmpPath;
                        $files[$baseName]['error'][] = 0;
                        $files[$baseName]['size'][] = strlen($body);
                    } else {
                        $files[$fieldName] = [
                            'name' => $fileName,
                            'type' => $fileType,
                            'tmp_name' => $tmpPath,
                            'error' => 0,
                            'size' => strlen($body)
                        ];
                    }
                    Logger::debug("📎 Archivo procesado en PUT: $fieldName ($fileName)");
                } else {
                    // Es un campo de texto
                    if (is_array($data)) {
                        $data[$fieldName] = $body;
                    }
                }
            }
        }
    }

    /**
     * Obtiene un valor específico con un valor por defecto
     */
    public static function get(string $key, $default = null) {
        $all = self::all();
        return $all[$key] ?? $default;
    }
}
