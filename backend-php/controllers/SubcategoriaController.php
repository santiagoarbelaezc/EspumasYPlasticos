<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use App\Utils\Logger;
use PDO;

class SubcategoriaController {
    public static function obtenerSubcategorias(): void {
        try {
            $nombre = $_GET['nombre'] ?? null;
            $categoria_id = $_GET['categoria_id'] ?? null;
            $db = Database::getConnection();

            $sql = "
                SELECT s.id, s.nombre, s.categoria_id, c.nombre AS categoria
                FROM subcategorias s
                JOIN categorias c ON s.categoria_id = c.id
                WHERE 1=1
            ";
            $params = [];

            if ($nombre) {
                $sql .= " AND s.nombre LIKE ?";
                $params[] = "%$nombre%";
            }

            if ($categoria_id) {
                $sql .= " AND s.categoria_id = ?";
                $params[] = $categoria_id;
            }

            $sql .= " ORDER BY c.nombre ASC, s.nombre ASC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            Response::success($stmt->fetchAll());
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener las subcategorías', 500, $e->getMessage());
        }
    }

    public static function crearSubcategoria(): void {
        // En JSON POST, usar Request::all() para parsear correctamente en Hostinger
        $data = \App\Utils\Request::all();
        $nombre = $data['nombre'] ?? '';
        $categoria_id = $data['categoria_id'] ?? null;

        if (empty($nombre) || !$categoria_id) {
            Response::error('El nombre y la categoría son requeridos', 400);
        }

        try {
            Logger::info("📂 Creando nueva subcategoría: $nombre en categoría: $categoria_id");
            $db = Database::getConnection();
            $stmt = $db->prepare('INSERT INTO subcategorias (nombre, categoria_id) VALUES (?, ?)');
            $stmt->execute([$nombre, $categoria_id]);
            Logger::info("✅ Subcategoría creada con éxito");
            Response::success(['mensaje' => 'Subcategoría creada con éxito'], 201);
        } catch (\Exception $e) {
            Logger::error("❌ Error creando subcategoría: " . $e->getMessage());
            Response::error('No se pudo crear la subcategoría', 500, $e->getMessage());
        }
    }

    public static function actualizarSubcategoria(int $id): void {
        // En JSON POST/PUT, usar Request::all() para parsear correctamente en Hostinger
        $data = \App\Utils\Request::all();
        
        Logger::info("🔄 Intentando actualizar subcategoría ID: $id");
        Logger::debug("📥 Input data: " . json_encode($data));

        $nombre = $data['nombre'] ?? '';
        $categoria_id = $data['categoria_id'] ?? null;

        if (empty($nombre) || !$categoria_id) {
            Logger::warning("⚠️ Datos insuficientes para actualizar subcategoría ID $id. Nombre: '$nombre', CategoriaID: '$categoria_id'");
            Response::error('El nombre y la categoría son requeridos', 400);
        }

        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('UPDATE subcategorias SET nombre = ?, categoria_id = ? WHERE id = ?');
            $stmt->execute([$nombre, $categoria_id, $id]);
            
            Logger::info("✅ Subcategoría ID $id actualizada con éxito");
            Response::success(['mensaje' => 'Subcategoría actualizada con éxito']);
        } catch (\Exception $e) {
            Logger::error("❌ Error actualizando subcategoría ID $id: " . $e->getMessage());
            Response::error('No se pudo actualizar la subcategoría', 500, $e->getMessage());
        }
    }

    public static function eliminarSubcategoria(int $id): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('DELETE FROM subcategorias WHERE id = ?');
            $stmt->execute([$id]);
            Response::success(['mensaje' => 'Subcategoría eliminada correctamente']);
        } catch (\Exception $e) {
            Response::error('No se pudo eliminar la subcategoría', 500, $e->getMessage());
        }
    }
}
