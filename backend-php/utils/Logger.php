<?php

declare(strict_types=1);

namespace App\Utils;

class Logger {
    private static string $logFile = __DIR__ . '/../logs/app.log';

    public static function init(): void {
        $logDir = __DIR__ . '/../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }
    }

    public static function log(string $message, string $level = 'INFO'): void {
        self::init();
        $timestamp = date('Y-m-d H:i:s');
        $formattedMessage = "[$timestamp] [$level] $message" . PHP_EOL;
        
        // Log to file
        file_put_contents(self::$logFile, $formattedMessage, FILE_APPEND);
        
        // Log to dev console (if in CLI or if desired to see in error log)
        error_log($formattedMessage);

        // For local development feedback, if we want to see it in the terminal running a server:
        if (php_sapi_name() === 'cli-server' || php_sapi_name() === 'cli') {
            echo $formattedMessage;
        }
    }

    public static function info(string $message): void {
        self::log($message, 'INFO');
    }

    public static function error(string $message): void {
        self::log($message, 'ERROR');
    }

    public static function warning(string $message): void {
        self::log($message, 'WARNING');
    }

    public static function request(string $method, string $uri): void {
        self::log("REQUEST: $method $uri", 'HTTP');
    }
}
