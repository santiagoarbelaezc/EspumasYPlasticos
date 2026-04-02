<?php

declare(strict_types=1);

namespace App\Utils;

class Response {
    public static function success($data = [], int $code = 200): void {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode($data);
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
        echo json_encode($response);
        exit;
    }
}
