<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use App\Utils\Logger;
use PDO;
use Throwable;

class ImportarController {
    public static function ejecutarImportacion(): void {
        set_time_limit(0);
        Logger::info("🚀 Iniciando proceso de importación desde Hostinger...");

        try {
            $dbLocal = Database::getConnection();
            $dbHostinger = Database::getHostingerConnection();

            // 1. Obtener productos de Hostinger (Plaxtilineas/Districol)
            // Según el código de referencia: category='Districol'
            // Pero el usuario dijo "en este caso son los productos de espumas"
            // Por seguridad, importaremos los que tengan categoría relacionada o todos los activos.
            // Usaremos la consulta del código proporcionado:
            $stmt = $dbHostinger->query("SELECT * FROM products WHERE deleted_at IS NULL");
            $productsHostinger = $stmt->fetchAll();

            if (empty($productsHostinger)) {
                Logger::info("ℹ️ No se encontraron productos para importar.");
                Response::success(['mensaje' => 'No hay productos nuevos para importar', 'importados' => 0, 'actualizados' => 0]);
                return;
            }

            Logger::info("📦 Encontrados " . count($productsHostinger) . " productos en Hostinger.");

            // Datos relacionados en Hostinger
            $ids = array_column($productsHostinger, 'id');
            $idsPlaceholders = implode(',', array_fill(0, count($ids), '?'));

            // Imágenes
            $imgStmt = $dbHostinger->prepare("SELECT product_id, url, description FROM product_images WHERE product_id IN ($idsPlaceholders)");
            $imgStmt->execute($ids);
            $allImages = $imgStmt->fetchAll();

            $imageMap = [];
            foreach ($allImages as $img) {
                $imageMap[$img['product_id']][] = [
                    'url' => $img['url'], 
                    'description' => $img['description']
                ];
            }

            // Variantes
            $varStmt = $dbHostinger->prepare("SELECT product_id, name, available, price FROM product_variants WHERE product_id IN ($idsPlaceholders)");
            $varStmt->execute($ids);
            $allVars = $varStmt->fetchAll();

            $varMap = [];
            foreach ($allVars as $var) {
                $varMap[$var['product_id']][] = $var;
            }

            $importados = 0;
            $actualizados = 0;

            $dbLocal->beginTransaction();

            foreach ($productsHostinger as $product) {
                $hostingerId = (int)$product['id'];
                
                // Buscar si ya existe
                $checkStmt = $dbLocal->prepare('SELECT id FROM productos WHERE id = ?');
                $checkStmt->execute([$hostingerId]);
                $existe = $checkStmt->fetch();

                // Resolver categoría -> subcategoría
                $subcatId = self::resolverSubcategoria($dbLocal, $product['category'] ?? 'General');

                // Calcular precio y cantidad base desde la primera variante
                $precioBase = 0;
                $cantidadBase = 0;
                if (isset($varMap[$hostingerId]) && !empty($varMap[$hostingerId])) {
                    $precioBase = $varMap[$hostingerId][0]['price'];
                    foreach ($varMap[$hostingerId] as $v) {
                        $cantidadBase += (int)$v['available'];
                    }
                }

                if ($existe) {
                    // Update
                    $updStmt = $dbLocal->prepare('
                        UPDATE productos 
                        SET nombre=?, descripcion=?, material=?, category=?, options=?, isNew=?, isFeatured=?, marca=?, gramaje=?, brandIconUrl=?, subcategoria_id=?, precio=?, cantidad=?
                        WHERE id=?
                    ');
                    $updStmt->execute([
                        $product['name'], $product['description'], $product['material'], $product['category'],
                        $product['options'], $product['isNew'], $product['isFeatured'], $product['marca'], 
                        $product['gramaje'], $product['brandIconUrl'], $subcatId, $precioBase, $cantidadBase, $hostingerId
                    ]);
                    $actualizados++;
                } else {
                    // Insert
                    $insStmt = $dbLocal->prepare('
                        INSERT INTO productos (id, nombre, descripcion, material, category, options, isNew, isFeatured, marca, gramaje, brandIconUrl, subcategoria_id, precio, cantidad, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ');
                    $insStmt->execute([
                        $hostingerId, $product['name'], $product['description'], $product['material'], $product['category'],
                        $product['options'], $product['isNew'], $product['isFeatured'], $product['marca'], 
                        $product['gramaje'], $product['brandIconUrl'], $subcatId, $precioBase, $cantidadBase, $product['created_at']
                    ]);
                    $importados++;
                }

                // Sincronizar imágenes
                if (isset($imageMap[$hostingerId])) {
                    $dbLocal->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?')->execute([$hostingerId]);
                    $imgIns = $dbLocal->prepare('INSERT INTO producto_imagenes (producto_id, imagen_url, description) VALUES (?, ?, ?)');
                    foreach ($imageMap[$hostingerId] as $img) {
                        $imgIns->execute([$hostingerId, $img['url'], $img['description']]);
                    }
                }

                // Sincronizar variantes
                if (isset($varMap[$hostingerId])) {
                    $dbLocal->prepare('DELETE FROM producto_variantes WHERE producto_id = ?')->execute([$hostingerId]);
                    $varIns = $dbLocal->prepare('INSERT INTO producto_variantes (producto_id, nombre, disponible, precio) VALUES (?, ?, ?, ?)');
                    foreach ($varMap[$hostingerId] as $var) {
                        $varIns->execute([$hostingerId, $var['name'], $var['available'], $var['price']]);
                    }
                }
            }

            $dbLocal->commit();
            Logger::info("✅ Importación finalizada: $importados creados, $actualizados actualizados.");

            Response::success([
                'mensaje' => 'Importación completada con éxito',
                'importados' => $importados,
                'actualizados' => $actualizados
            ]);

        } catch (Throwable $e) {
            if (isset($dbLocal) && $dbLocal->inTransaction()) {
                $dbLocal->rollBack();
            }
            Logger::error("❌ Error fatal en importación: " . $e->getMessage());
            Response::error('Error fatal durante la importación: ' . $e->getMessage(), 500);
        }
    }

    private static function resolverSubcategoria(PDO $db, string $categoryName): int {
        // Buscar o crear categoría
        $stmt = $db->prepare("SELECT id FROM categorias WHERE nombre = ? LIMIT 1");
        $stmt->execute([$categoryName]);
        $cat = $stmt->fetch();

        if ($cat) {
            $catId = (int)$cat['id'];
        } else {
            $db->prepare("INSERT INTO categorias (nombre) VALUES (?)")->execute([$categoryName]);
            $catId = (int)$db->lastInsertId();
        }

        // Buscar o crear subcategoría 'General'
        $stmt = $db->prepare("SELECT id FROM subcategorias WHERE nombre = 'General' AND categoria_id = ? LIMIT 1");
        $stmt->execute([$catId]);
        $sub = $stmt->fetch();

        if ($sub) {
            return (int)$sub['id'];
        }

        $db->prepare("INSERT INTO subcategorias (nombre, categoria_id) VALUES ('General', ?)")->execute([$catId]);
        return (int)$db->lastInsertId();
    }
}
