<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Config\CloudinaryConfig;
use App\Utils\Response;
use App\Utils\Logger;
use App\Middleware\UploadMiddleware;
use PDO;

class ProductoController {
    public static function obtenerProductos(): void {
        try {
            $db = Database::getConnection();

            // Parámetros de filtrado
            $subcategoria_id = $_GET['subcategoria_id'] ?? null;
            $categoria_id = $_GET['categoria_id'] ?? null;
            $nombre = $_GET['nombre'] ?? null;
            $minPrice = $_GET['min_precio'] ?? null;
            $maxPrice = $_GET['max_precio'] ?? null;

            $sql = "
              SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                p.subcategoria_id,
                s.nombre AS subcategoria,
                c.id AS categoria_id,
                c.nombre AS categoria
              FROM productos p
              JOIN subcategorias s ON p.subcategoria_id = s.id
              JOIN categorias c ON s.categoria_id = c.id
              WHERE 1=1
            ";
            $params = [];

            if ($subcategoria_id) {
                $sql .= ' AND p.subcategoria_id = ?';
                $params[] = $subcategoria_id;
            }

            if ($categoria_id) {
                $sql .= ' AND c.id = ?';
                $params[] = $categoria_id;
            }

            if ($nombre) {
                $sql .= ' AND p.nombre LIKE ?';
                $params[] = "%$nombre%";
            }

            if ($minPrice !== null && $minPrice !== '') {
                $sql .= ' AND p.precio >= ?';
                $params[] = (float)$minPrice;
            }

            if ($maxPrice !== null && $maxPrice !== '') {
                $sql .= ' AND p.precio <= ?';
                $params[] = (float)$maxPrice;
            }

            $sql .= " ORDER BY p.id DESC"; // Ordenar para que los más nuevos aparezcan arriba en el dashboard

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $productos = $stmt->fetchAll();

            if (empty($productos)) {
                Response::success([]);
            }

            $productoIds = array_column($productos, 'id');
            $placeholders = implode(',', array_fill(0, count($productoIds), '?'));
            
            $stmtImg = $db->prepare("SELECT producto_id, imagen_url FROM producto_imagenes WHERE producto_id IN ($placeholders)");
            $stmtImg->execute($productoIds);
            $imagenes = $stmtImg->fetchAll();

            foreach ($productos as &$prod) {
                $prod['imagenes'] = array_column(
                    array_filter($imagenes, fn($img) => $img['producto_id'] == $prod['id']),
                    'imagen_url'
                );
            }

            Response::success($productos);
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener los productos', 500, $e->getMessage());
        }
    }

    public static function obtenerProductosAleatorios(): void {
        try {
            $cantidad = isset($_GET['cantidad']) ? (int)$_GET['cantidad'] : 5;
            $db = Database::getConnection();

            $stmt = $db->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                  p.subcategoria_id,
                  s.nombre AS subcategoria,
                  c.nombre AS categoria
                FROM productos p
                JOIN subcategorias s ON p.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                ORDER BY RAND()
                LIMIT ?
            ");
            $stmt->bindValue(1, $cantidad, PDO::PARAM_INT);
            $stmt->execute();
            $productos = $stmt->fetchAll();

            if (empty($productos)) {
                Response::success([]);
            }

            $productoIds = array_column($productos, 'id');
            $placeholders = implode(',', array_fill(0, count($productoIds), '?'));
            
            $stmtImg = $db->prepare("SELECT producto_id, imagen_url FROM producto_imagenes WHERE producto_id IN ($placeholders)");
            $stmtImg->execute($productoIds);
            $imagenes = $stmtImg->fetchAll();

            foreach ($productos as &$prod) {
                $prod['imagenes'] = array_column(
                    array_filter($imagenes, fn($img) => $img['producto_id'] == $prod['id']),
                    'imagen_url'
                );
            }

            Response::success($productos);
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener productos aleatorios', 500, $e->getMessage());
        }
    }

    public static function obtenerProductosPorCategoria(int $categoria_id): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                  p.subcategoria_id,
                  s.nombre AS subcategoria,
                  c.nombre AS categoria
                FROM productos p
                JOIN subcategorias s ON p.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                WHERE c.id = ?
            ");
            $stmt->execute([$categoria_id]);
            $productos = $stmt->fetchAll();

            if (empty($productos)) {
                Response::success([]);
            }

            $productoIds = array_column($productos, 'id');
            $placeholders = implode(',', array_fill(0, count($productoIds), '?'));
            
            $stmtImg = $db->prepare("SELECT producto_id, imagen_url FROM producto_imagenes WHERE producto_id IN ($placeholders)");
            $stmtImg->execute($productoIds);
            $imagenes = $stmtImg->fetchAll();

            foreach ($productos as &$prod) {
                $prod['imagenes'] = array_column(
                    array_filter($imagenes, fn($img) => $img['producto_id'] == $prod['id']),
                    'imagen_url'
                );
            }

            Response::success($productos);
        } catch (\Exception $e) {
            Response::error('No se pudieron obtener productos por categoría', 500, $e->getMessage());
        }
    }

    public static function crearProducto(): void {
        // En PHP Multipart POST (FormData), los campos están en $_POST y archivos en $_FILES
        $nombre = trim($_POST['nombre'] ?? '');
        $descripcion = trim($_POST['descripcion'] ?? '');
        $cantidad = (int)($_POST['cantidad'] ?? 0);
        $precio = (float)($_POST['precio'] ?? 0);
        $subcategoria_id = (int)($_POST['subcategoria_id'] ?? 0);

        Logger::info("📦 Intentando crear producto: $nombre");
        Logger::debug("📥 POST data: nombre=$nombre, cantidad=$cantidad, precio=$precio, subcategoria_id=$subcategoria_id");

        if (empty($nombre) || $precio <= 0 || $cantidad < 0 || !$subcategoria_id) {
            Logger::warning("⚠️  Intento de creación de producto con datos inválidos");
            Response::error('Datos inválidos. Verifica los campos del formulario.', 400);
        }

        // Manejo de imágenes - puede venir como 'imagenes' (plural, array) o 'imagen' (singular)
        $imagesInfo = UploadMiddleware::handleMultipleUpload('imagenes', 'espumas_plasticos_productos');

        if (empty($imagesInfo)) {
            Logger::warning("⚠️  Intento de creación de producto sin imágenes");
            Response::error('Debes subir al menos una imagen del producto.', 400);
        }

        $db = Database::getConnection();
        try {
            Logger::info("📦 Creando nuevo producto: $nombre con " . count($imagesInfo) . " imágenes");
            $db->beginTransaction();

            $stmt = $db->prepare('INSERT INTO productos (nombre, descripcion, cantidad, precio, subcategoria_id) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $subcategoria_id]);
            $productoId = $db->lastInsertId();

            foreach ($imagesInfo as $img) {
                $stmtImg = $db->prepare('INSERT INTO producto_imagenes (producto_id, imagen_url, public_id) VALUES (?, ?, ?)');
                $stmtImg->execute([$productoId, $img['secure_url'], $img['public_id']]);
            }

            $db->commit();
            Logger::info("✅ Producto creado exitosamente: ID $productoId");
            Response::success(['mensaje' => 'Producto creado exitosamente', 'productoId' => $productoId], 201);
        } catch (\Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            Logger::error("❌ Error creando producto: " . $e->getMessage());
            Response::error('Error interno al crear el producto', 500, $e->getMessage());
        }
    }

    public static function buscarProductosPorNombre(): void {
        try {
            $nombre = $_GET['nombre'] ?? '';
            if (empty(trim($nombre))) {
                Response::error('Debes proporcionar un nombre para buscar.', 400);
            }

            $db = Database::getConnection();
            $stmt = $db->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                  p.subcategoria_id,
                  s.nombre AS subcategoria,
                  c.nombre AS categoria
                FROM productos p
                JOIN subcategorias s ON p.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                WHERE p.nombre LIKE ?
            ");
            $stmt->execute(["%$nombre%"]);
            $productos = $stmt->fetchAll();

            if (empty($productos)) {
                Response::success([]);
            }

            $productoIds = array_column($productos, 'id');
            $placeholders = implode(',', array_fill(0, count($productoIds), '?'));
            
            $stmtImg = $db->prepare("SELECT producto_id, imagen_url FROM producto_imagenes WHERE producto_id IN ($placeholders)");
            $stmtImg->execute($productoIds);
            $imagenes = $stmtImg->fetchAll();

            foreach ($productos as &$prod) {
                $prod['imagenes'] = array_column(
                    array_filter($imagenes, fn($img) => $img['producto_id'] == $prod['id']),
                    'imagen_url'
                );
            }

            Response::success($productos);
        } catch (\Exception $e) {
            Response::error('No se pudo realizar la búsqueda de productos', 500, $e->getMessage());
        }
    }

    public static function actualizarProducto(int $id): void {
        // En PUT requests con FormData, usar Request::all() porque PHP no puebla automáticamente $_POST
        $params = \App\Utils\Request::all();
        $nombre = trim($params['nombre'] ?? '');
        $descripcion = trim($params['descripcion'] ?? '');
        $cantidad = (int)($params['cantidad'] ?? 0);
        $precio = (float)($params['precio'] ?? 0);
        $subcategoria_id = (int)($params['subcategoria_id'] ?? 0);

        Logger::info("🔄 Intentando actualizar producto ID: $id - Nombre: $nombre");
        Logger::debug("📥 PUT data: nombre=$nombre, cantidad=$cantidad, precio=$precio, subcategoria_id=$subcategoria_id");

        if (empty($nombre) || $precio <= 0 || $cantidad < 0 || !$subcategoria_id) {
            Logger::warning("⚠️ Datos inválidos para actualizar producto ID $id");
            Response::error('Datos inválidos. Verifica los campos del formulario.', 400);
        }

        $db = Database::getConnection();
        try {
            $stmt = $db->prepare('SELECT id FROM productos WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                Logger::warning("⚠️ Producto ID $id no encontrado");
                Response::error('Producto no encontrado', 404);
            }

            $db->beginTransaction();

            // La columna updated_at se actualiza automáticamente por el trigger de MySQL si fue definida como ON UPDATE CURRENT_TIMESTAMP
            $stmt = $db->prepare('UPDATE productos SET nombre = ?, descripcion = ?, cantidad = ?, precio = ?, subcategoria_id = ? WHERE id = ?');
            $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $subcategoria_id, $id]);

            // Manejo de nuevas imágenes si se proporcionan
            $imagesInfo = UploadMiddleware::handleMultipleUpload('imagenes', 'espumas_plasticos_productos');

            if (!empty($imagesInfo)) {
                Logger::info("🖼️ Reemplazando " . count($imagesInfo) . " imágenes para producto ID $id");
                
                // Eliminar imágenes anteriores en Cloudinary y DB
                $stmtOld = $db->prepare('SELECT public_id FROM producto_imagenes WHERE producto_id = ?');
                $stmtOld->execute([$id]);
                $oldImgs = $stmtOld->fetchAll();

                foreach ($oldImgs as $img) {
                    if ($img['public_id']) CloudinaryConfig::delete($img['public_id']);
                }

                $stmtDel = $db->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?');
                $stmtDel->execute([$id]);

                // Insertar nuevas
                foreach ($imagesInfo as $img) {
                    $stmtNew = $db->prepare('INSERT INTO producto_imagenes (producto_id, imagen_url, public_id) VALUES (?, ?, ?)');
                    $stmtNew->execute([$id, $img['secure_url'], $img['public_id']]);
                }
            }

            $db->commit();
            Logger::info("✅ Producto ID $id actualizado exitosamente");
            Response::success(['mensaje' => 'Producto actualizado con éxito']);
        } catch (\Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            Logger::error("❌ Error actualizando producto ID $id: " . $e->getMessage());
            Logger::error("📍 Trace: " . $e->getTraceAsString());
            Response::error('No se pudo actualizar el producto', 500, $e->getMessage());
        }
    }

    public static function eliminarProducto(int $id): void {
        $db = Database::getConnection();
        try {
            $stmt = $db->prepare('SELECT id FROM productos WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                Response::error('Producto no encontrado', 404);
            }

            $db->beginTransaction();

            $stmtImg = $db->prepare('SELECT public_id FROM producto_imagenes WHERE producto_id = ?');
            $stmtImg->execute([$id]);
            $images = $stmtImg->fetchAll();

            Logger::info("🗑️  Eliminando producto ID: $id (" . count($images) . " imágenes)");

            foreach ($images as $img) {
                CloudinaryConfig::delete($img['public_id']);
            }

            $stmtDel = $db->prepare('DELETE FROM productos WHERE id = ?');
            $stmtDel->execute([$id]);

            $db->commit();
            Response::success(['mensaje' => 'Producto e imágenes eliminados correctamente']);
        } catch (\Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
            Response::error('Error interno al eliminar el producto', 500, $e->getMessage());
        }
    }

    public static function obtenerProductoPorId(int $id): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                  p.subcategoria_id,
                  s.nombre AS subcategoria,
                  c.nombre AS categoria
                FROM productos p
                JOIN subcategorias s ON p.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$id]);
            $producto = $stmt->fetch();

            if (!$producto) {
                Response::error('Producto no encontrado', 404);
            }

            $stmtImg = $db->prepare('SELECT imagen_url FROM producto_imagenes WHERE producto_id = ?');
            $stmtImg->execute([$id]);
            $producto['imagenes'] = array_column($stmtImg->fetchAll(), 'imagen_url');

            Response::success($producto);
        } catch (\Exception $e) {
            Response::error('No se pudo obtener el producto', 500, $e->getMessage());
        }
    }
}
