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
        
        // Ciertas alertas críticas también al error_log del sistema
        if (in_array($level, ['ERROR', 'WARNING', 'FATAL'])) {
            error_log($formattedMessage);
        }
    }

    public static function info(string $message): void {
        self::log($message, 'INFO');
    }

    public static function debug(string $message): void {
        self::log($message, 'DEBUG');
    }

    public static function error(string $message): void {
        self::log($message, 'ERROR');
    }

    public static function fatal(string $message): void {
        self::log($message, 'FATAL');
    }

    public static function warning(string $message): void {
        self::log($message, 'WARNING');
    }

    public static function request(string $method, string $uri): void {
        self::log("REQUEST: $method $uri", 'HTTP');
    }

    private static function console(string $level, string $message): void {
        $time = date('Y-m-d H:i:s');
        error_log("[$time] [$level] $message");
    }
}
