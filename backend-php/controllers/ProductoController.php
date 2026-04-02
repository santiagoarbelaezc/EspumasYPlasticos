<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Config\CloudinaryConfig;
use App\Utils\Response;
use App\Middleware\UploadMiddleware;
use PDO;

class ProductoController {
    public static function obtenerProductos(): void {
        try {
            $subcategoria_id = $_GET['subcategoria_id'] ?? null;
            $db = Database::getConnection();

            $sql = "
              SELECT p.id, p.nombre, p.descripcion, p.cantidad, p.precio,
                p.subcategoria_id,
                s.nombre AS subcategoria,
                c.nombre AS categoria
              FROM productos p
              JOIN subcategorias s ON p.subcategoria_id = s.id
              JOIN categorias c ON s.categoria_id = c.id
            ";
            $params = [];

            if ($subcategoria_id) {
                $sql .= ' WHERE p.subcategoria_id = ?';
                $params[] = $subcategoria_id;
            }

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
        // En PHP Multipart POST, los campos están en $_POST y archivos en $_FILES
        $nombre = trim($_POST['nombre'] ?? '');
        $descripcion = trim($_POST['descripcion'] ?? '');
        $cantidad = (int)($_POST['cantidad'] ?? 0);
        $precio = (float)($_POST['precio'] ?? 0);
        $subcategoria_id = (int)($_POST['subcategoria_id'] ?? 0);

        if (empty($nombre) || $precio <= 0 || $cantidad < 0 || !$subcategoria_id) {
            Response::error('Datos inválidos. Verifica los campos del formulario.', 400);
        }

        $imagesInfo = UploadMiddleware::handleMultipleUpload('imagenes', 'espumas_plasticos_productos');

        if (empty($imagesInfo)) {
            Response::error('Debes subir al menos una imagen del producto.', 400);
        }

        $db = Database::getConnection();
        try {
            $db->beginTransaction();

            $stmt = $db->prepare('INSERT INTO productos (nombre, descripcion, cantidad, precio, subcategoria_id) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $subcategoria_id]);
            $productoId = $db->lastInsertId();

            foreach ($imagesInfo as $img) {
                $stmtImg = $db->prepare('INSERT INTO producto_imagenes (producto_id, imagen_url, public_id) VALUES (?, ?, ?)');
                $stmtImg->execute([$productoId, $img['secure_url'], $img['public_id']]);
            }

            $db->commit();
            Response::success(['mensaje' => 'Producto creado exitosamente', 'productoId' => $productoId], 201);
        } catch (\Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
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
        // En PHP Multipart POST (o PUT simulado), campos en $_POST
        $nombre = trim($_POST['nombre'] ?? '');
        $descripcion = trim($_POST['descripcion'] ?? '');
        $cantidad = (int)($_POST['cantidad'] ?? 0);
        $precio = (float)($_POST['precio'] ?? 0);
        $subcategoria_id = (int)($_POST['subcategoria_id'] ?? 0);

        $db = Database::getConnection();
        try {
            $stmt = $db->prepare('SELECT id FROM productos WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                Response::error('Producto no encontrado', 404);
            }

            $db->beginTransaction();

            $stmt = $db->prepare('UPDATE productos SET nombre = ?, descripcion = ?, cantidad = ?, precio = ?, subcategoria_id = ? WHERE id = ?');
            $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $subcategoria_id, $id]);

            $imagesInfo = UploadMiddleware::handleMultipleUpload('imagenes', 'espumas_plasticos_productos');

            if (!empty($imagesInfo)) {
                // Eliminar imágenes anteriores
                $stmtOld = $db->prepare('SELECT public_id FROM producto_imagenes WHERE producto_id = ?');
                $stmtOld->execute([$id]);
                $oldImgs = $stmtOld->fetchAll();

                foreach ($oldImgs as $img) {
                    CloudinaryConfig::delete($img['public_id']);
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
            Response::success(['mensaje' => 'Producto actualizado con éxito']);
        } catch (\Exception $e) {
            if ($db->inTransaction()) $db->rollBack();
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
