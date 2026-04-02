<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use PDO;

class SubcategoriaController {
    public static function obtenerSubcategorias(): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->query('
                SELECT s.id, s.nombre, s.categoria_id, c.nombre AS categoria
                FROM subcategorias s
                JOIN categorias c ON s.categoria_id = c.id
            ');
            Response::success($stmt->fetchAll());
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener las subcategorías', 500, $e->getMessage());
        }
    }

    public static function crearSubcategoria(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $nombre = $data['nombre'] ?? '';
        $categoria_id = $data['categoria_id'] ?? null;

        if (empty($nombre) || !$categoria_id) {
            Response::error('El nombre y la categoría son requeridos', 400);
        }

        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('INSERT INTO subcategorias (nombre, categoria_id) VALUES (?, ?)');
            $stmt->execute([$nombre, $categoria_id]);
            Response::success(['mensaje' => 'Subcategoría creada con éxito'], 201);
        } catch (\Exception $e) {
            Response::error('No se pudo crear la subcategoría', 500, $e->getMessage());
        }
    }

    public static function actualizarSubcategoria(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $nombre = $data['nombre'] ?? '';
        $categoria_id = $data['categoria_id'] ?? null;

        if (empty($nombre) || !$categoria_id) {
            Response::error('El nombre y la categoría son requeridos', 400);
        }

        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('UPDATE subcategorias SET nombre = ?, categoria_id = ? WHERE id = ?');
            $stmt->execute([$nombre, $categoria_id, $id]);
            Response::success(['mensaje' => 'Subcategoría actualizada con éxito']);
        } catch (\Exception $e) {
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
