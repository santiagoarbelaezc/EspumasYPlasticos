<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Config\CloudinaryConfig;
use App\Utils\Response;
use App\Utils\Logger;
use App\Middleware\UploadMiddleware;
use PDO;

class CategoriaController {
    public static function obtenerCategorias(): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->query('SELECT * FROM categorias');
            $rows = $stmt->fetchAll();
            Response::success($rows);
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener las categorías', 500, $e->getMessage());
        }
    }

    public static function crearCategoria(): void {
        $nombre = $_POST['nombre'] ?? '';
        
        if (empty($nombre)) {
            Logger::warning("⚠️  Intento de creación de categoría sin nombre");
            Response::error('El nombre es obligatorio', 400);
        }

        $imageInfo = UploadMiddleware::handleSingleUpload('icono', 'espumas_plasticos_categorias');
        $icono_url = $imageInfo['secure_url'] ?? null;
        $icono_public_id = $imageInfo['public_id'] ?? null;

        try {
            Logger::info("📂 Creando nueva categoría: $nombre");
            $db = Database::getConnection();
            if ($icono_url) {
                $stmt = $db->prepare('INSERT INTO categorias (nombre, icono_url, icono_public_id) VALUES (?, ?, ?)');
                $stmt->execute([$nombre, $icono_url, $icono_public_id]);
            } else {
                $stmt = $db->prepare('INSERT INTO categorias (nombre) VALUES (?)');
                $stmt->execute([$nombre]);
            }

            Response::success([
                'mensaje' => 'Categoría creada con éxito',
                'id' => $db->lastInsertId(),
                'icono_url' => $icono_url
            ], 201);
        } catch (\Exception $e) {
            Response::error('No se pudo crear la categoría', 500, $e->getMessage());
        }
    }

    public static function actualizarCategoria(int $id): void {
        $params = \App\Utils\Request::all();
        $nombre = $params['nombre'] ?? '';
        
        Logger::info("🔄 Intentando actualizar categoría ID: $id");
        Logger::debug("📥 Parámetros recibidos: " . json_encode($params));

        if (empty($nombre)) {
            Logger::warning("⚠️  Intento de actualizar categoría ID $id sin nombre");
            Response::error('El nombre es obligatorio', 400);
        }

        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('SELECT icono_public_id FROM categorias WHERE id = ?');
            $stmt->execute([$id]);
            $rows = $stmt->fetchAll();

            if (empty($rows)) {
                Logger::warning("⚠️ Categoría ID $id no encontrada para actualización");
                Response::error('Categoría no encontrada', 404);
            }

            $oldPublicId = $rows[0]['icono_public_id'];
            
            // Nota: handleSingleUpload solo funcionará si los archivos vienen en $_FILES 
            // Esto sucede en POST con FormData. Para PUT multipart real, PHP tiene limitaciones.
            $imageInfo = UploadMiddleware::handleSingleUpload('icono', 'espumas_plasticos_categorias');
            $nuevoIcono = $imageInfo['secure_url'] ?? null;
            $nuevoPublicId = $imageInfo['public_id'] ?? null;

            if ($nuevoIcono && $oldPublicId) {
                Logger::info("🖼️ Reemplazando imagen antigua: $oldPublicId");
                CloudinaryConfig::delete($oldPublicId);
            }

            $sql = 'UPDATE categorias SET nombre = ?';
            $sqlParams = [$nombre];

            if ($nuevoIcono) {
                $sql .= ', icono_url = ?, icono_public_id = ?';
                array_push($sqlParams, $nuevoIcono, $nuevoPublicId);
            }

            $sql .= ' WHERE id = ?';
            $sqlParams[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($sqlParams);

            Logger::info("✅ Categoría ID $id actualizada correctamente");
            Response::success(['mensaje' => '✅ Categoría actualizada correctamente']);
        } catch (\Exception $e) {
            Logger::error("❌ Error actualizando categoría ID $id: " . $e->getMessage());
            Logger::error("📍 Trace: " . $e->getTraceAsString());
            Response::error('No se pudo actualizar la categoría', 500, $e->getMessage());
        }
    }

    public static function eliminarCategoria(int $id): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('SELECT icono_public_id FROM categorias WHERE id = ?');
            $stmt->execute([$id]);
            $rows = $stmt->fetchAll();

            if (!empty($rows) && $rows[0]['icono_public_id']) {
                CloudinaryConfig::delete($rows[0]['icono_public_id']);
            }

            $stmt = $db->prepare('DELETE FROM categorias WHERE id = ?');
            $stmt->execute([$id]);

            Logger::info("✅ Categoría ID: $id eliminada correctamente");
            Response::success(['mensaje' => 'Categoría eliminada correctamente']);
        } catch (\Exception $e) {
            Logger::error("❌ Error eliminando categoría: " . $e->getMessage());
            Response::error('No se pudo eliminar la categoría', 500, $e->getMessage());
        }
    }

    public static function obtenerCategoriasConSubcategorias(): void {
        $sql = "
            SELECT 
              c.id AS categoria_id,
              c.nombre AS categoria_nombre,
              c.icono_url,
              s.id AS subcategoria_id,
              s.nombre AS subcategoria_nombre,
              COUNT(p.id) AS cantidad_productos
            FROM categorias c
            LEFT JOIN subcategorias s ON s.categoria_id = c.id
            LEFT JOIN productos p ON p.subcategoria_id = s.id
            GROUP BY c.id, s.id
            ORDER BY c.nombre, s.nombre;
        ";

        try {
            $db = Database::getConnection();
            $stmt = $db->query($sql);
            $results = $stmt->fetchAll();

            $categorias = [];
            foreach ($results as $row) {
                $catId = $row['categoria_id'];
                if (!isset($categorias[$catId])) {
                    $categorias[$catId] = [
                        'id' => $catId,
                        'nombre' => $row['categoria_nombre'],
                        'icono_url' => $row['icono_url'],
                        'subcategorias' => []
                    ];
                }

                if ($row['subcategoria_id']) {
                    $categorias[$catId]['subcategorias'][] = [
                        'id' => $row['subcategoria_id'],
                        'nombre' => $row['subcategoria_nombre'],
                        'cantidad' => $row['cantidad_productos']
                    ];
                }
            }

            Response::success(array_values($categorias));
        } catch (\Exception $e) {
            Response::error('Error interno al procesar categorías', 500, $e->getMessage());
        }
    }
}
