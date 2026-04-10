<?php

declare(strict_types=1);

namespace App\Utils;

class Response {
    public static function success($data = [], int $code = 200): void {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($code);
        $json = json_encode($data);
        Logger::info("OUTGOING SUCCESS: " . (strlen($json) > 100 ? substr($json, 0, 100) . "..." : $json));
        echo $json;
        exit;
    }

    public static function error(string $message, int $code = 400, $details = null): void {
        header('Content-Type: application/json');
        http_response_code($code);
        
        $response = [
            'error' => $message
        ];
        
        if ($details) {
            $response['details'] = $details;
        }

        $logMsg = "OUTGOING ERROR ($code): $message" . ($details ? " | Details: " . (is_string($details) ? $details : json_encode($details)) : "");
        if ($code >= 500) {
            Logger::error($logMsg);
        } else {
            Logger::warning($logMsg);
        }

        echo json_encode($response);
        exit;
    }
}
