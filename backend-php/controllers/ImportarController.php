<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use App\Utils\Logger;
use PDO;
use Throwable;
use PDOException;

class ImportarController {
    public static function ejecutarImportacion(): void {
        set_time_limit(0);
        Logger::info("🚀 Iniciando proceso de importación desde Hostinger (Categoría: Espumas)...");

        try {
            Logger::info("🔌 Conectando a BD local...");
            $dbLocal = Database::getConnection();
            Logger::info("✅ BD local conectada.");

            Logger::info("🔌 Conectando a BD Hostinger (catálogo)...");
            $dbHostinger = Database::getHostingerConnection();
            Logger::info("✅ BD Hostinger conectada.");

            // Verificación previa: la base de datos local debe tener la tabla "productos"
            try {
                $dbLocal->query("SELECT 1 FROM productos LIMIT 1");
                Logger::info("✅ Tabla 'productos' verificada en BD local.");
            } catch (PDOException $e) {
                Logger::error("❌ Tabla 'productos' no encontrada en BD local: " . $e->getMessage());
                Response::error('Error: La base de datos local no tiene la estructura correcta (falta la tabla "productos").', 400);
                return;
            }

            // Verificar tabla producto_imagenes
            try {
                $dbLocal->query("SELECT 1 FROM producto_imagenes LIMIT 1");
                Logger::info("✅ Tabla 'producto_imagenes' verificada.");
            } catch (PDOException $e) {
                Logger::error("❌ Tabla 'producto_imagenes' no encontrada: " . $e->getMessage());
                Response::error('Falta la tabla "producto_imagenes" en la BD local.', 400);
                return;
            }

            // Verificar tabla producto_variantes
            try {
                $dbLocal->query("SELECT 1 FROM producto_variantes LIMIT 1");
                Logger::info("✅ Tabla 'producto_variantes' verificada.");
            } catch (PDOException $e) {
                Logger::error("❌ Tabla 'producto_variantes' no encontrada: " . $e->getMessage());
                Response::error('Falta la tabla "producto_variantes" en la BD local.', 400);
                return;
            }

            // Verificar tabla producto_colores
            $tieneColores = true;
            try {
                $dbLocal->query("SELECT 1 FROM producto_colores LIMIT 1");
                Logger::info("✅ Tabla 'producto_colores' verificada.");
            } catch (PDOException $e) {
                Logger::warning("⚠️ Tabla 'producto_colores' no disponible en BD local, se omitirá la sincronización de colores.");
                $tieneColores = false;
            }

            // 1. Obtener productos de Hostinger con categoría 'Espumas'
            Logger::info("📡 Consultando productos en Hostinger (category='Espumas')...");
            $stmt = $dbHostinger->query("SELECT * FROM products WHERE deleted_at IS NULL AND category='Espumas'");
            $productsHostinger = $stmt->fetchAll();
            Logger::info("📦 Hostinger devolvió " . count($productsHostinger) . " producto(s).");

            if (empty($productsHostinger)) {
                Logger::info("ℹ️ No se encontraron productos con la categoría 'Espumas' para importar.");
                Response::success([
                    'status' => 'success',
                    'mensaje' => "No hay productos nuevos para importar con la categoría 'Espumas'",
                    'importados' => 0,
                    'actualizados' => 0
                ]);
                return;
            }

            // IDs para queries relacionadas
            $ids = array_column($productsHostinger, 'id');
            $idsPlaceholders = implode(',', array_fill(0, count($ids), '?'));
            Logger::info("🔑 IDs a procesar: [" . implode(', ', $ids) . "]");

            // 2. Obtener imágenes
            Logger::info("🖼️ Cargando imágenes desde Hostinger...");
            $imgStmt = $dbHostinger->prepare("SELECT product_id, url, description FROM product_images WHERE product_id IN ($idsPlaceholders)");
            $imgStmt->execute($ids);
            $allImages = $imgStmt->fetchAll();
            Logger::info("🖼️ Total imágenes obtenidas: " . count($allImages));

            $imageMap = [];
            foreach ($allImages as $img) {
                $pid = $img['product_id'];
                $url = $img['url'];
                
                // Evitar procesar la misma URL para el mismo producto (evita colisión de uk_public_id)
                if (isset($imageMap[$pid])) {
                    $urlsYaProcesadas = array_column($imageMap[$pid], 'url');
                    if (in_array($url, $urlsYaProcesadas)) continue;
                }

                $publicId = $pid . '-' . md5($url);
                $imageMap[$pid][] = [
                    'url' => $url,
                    'description' => $img['description'],
                    'public_id' => $publicId
                ];
            }

            // 3. Obtener variantes
            Logger::info("📐 Cargando variantes desde Hostinger...");
            $varStmt = $dbHostinger->prepare("SELECT product_id, name, available, price FROM product_variants WHERE product_id IN ($idsPlaceholders)");
            $varStmt->execute($ids);
            $allVars = $varStmt->fetchAll();
            Logger::info("📐 Total variantes obtenidas: " . count($allVars));

            $varMap = [];
            foreach ($allVars as $var) {
                $varMap[$var['product_id']][] = $var;
            }

            // 4. Obtener colores
            $colorMap = [];
            try {
                Logger::info("🎨 Cargando colores desde Hostinger...");
                $colStmt = $dbHostinger->prepare("SELECT product_id, color FROM product_colors WHERE product_id IN ($idsPlaceholders)");
                $colStmt->execute($ids);
                $allColors = $colStmt->fetchAll();
                Logger::info("🎨 Total colores obtenidos: " . count($allColors));
                foreach ($allColors as $col) {
                    $colorMap[$col['product_id']][] = $col['color'];
                }
            } catch (Throwable $e) {
                Logger::warning("⚠️ No se pudieron obtener colores desde Hostinger: " . $e->getMessage());
                $colorMap = [];
            }

            $importados = 0;
            $actualizados = 0;

            Logger::info("🔄 Iniciando transacción en BD local...");
            $dbLocal->beginTransaction();

            foreach ($productsHostinger as $product) {
                $hostingerId = (int)$product['id'];
                Logger::info("  ➡️ Procesando producto ID=$hostingerId nombre='{$product['name']}'");

                // Buscar si ya existe
                $checkStmt = $dbLocal->prepare('SELECT id FROM productos WHERE id = ?');
                $checkStmt->execute([$hostingerId]);
                $existe = $checkStmt->fetch();

                // Resolver categoría → subcategoría
                $subcatId = self::resolverSubcategoria($dbLocal, $product['category'] ?? 'Espumas');
                Logger::info("    📂 subcategoria_id resuelto: $subcatId");

                // Precio y cantidad base desde variantes
                $precioBase = 0.0;
                $cantidadBase = 0;
                if (isset($varMap[$hostingerId]) && !empty($varMap[$hostingerId])) {
                    $precioBase = (float)($varMap[$hostingerId][0]['price'] ?? 0);
                    foreach ($varMap[$hostingerId] as $v) {
                        $cantidadBase += (int)($v['available'] ?? 0);
                    }
                }
                Logger::info("    💰 precioBase=$precioBase | cantidadBase=$cantidadBase");

                if ($existe) {
                    Logger::info("    🔁 Actualizando producto existente ID=$hostingerId...");
                    $updStmt = $dbLocal->prepare('
                        UPDATE productos 
                        SET nombre=?, descripcion=?, material=?, category=?, options=?, isNew=?, isFeatured=?, marca=?, gramaje=?, brandIconUrl=?, subcategoria_id=?, precio=?, cantidad=?
                        WHERE id=?
                    ');
                    $updStmt->execute([
                        $product['name'], $product['description'], $product['material'], $product['category'],
                        $product['options'], $product['isNew'], $product['isFeatured'], $product['marca'],
                        $product['gramaje'], $product['brandIconUrl'], $subcatId,
                        $precioBase, $cantidadBase, $hostingerId
                    ]);
                    $actualizados++;
                    Logger::info("    ✅ Producto ID=$hostingerId actualizado.");
                } else {
                    Logger::info("    ➕ Insertando nuevo producto ID=$hostingerId...");
                    $insStmt = $dbLocal->prepare('
                        INSERT INTO productos (id, nombre, descripcion, material, category, options, isNew, isFeatured, marca, gramaje, brandIconUrl, subcategoria_id, precio, cantidad, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ');
                    $insStmt->execute([
                        $hostingerId, $product['name'], $product['description'], $product['material'], $product['category'],
                        $product['options'], $product['isNew'], $product['isFeatured'], $product['marca'],
                        $product['gramaje'], $product['brandIconUrl'], $subcatId,
                        $precioBase, $cantidadBase, $product['created_at']
                    ]);
                    $importados++;
                    Logger::info("    ✅ Producto ID=$hostingerId insertado.");
                }

                // Sincronizar imágenes
                if (isset($imageMap[$hostingerId])) {
                    Logger::info("    🖼️ Sincronizando " . count($imageMap[$hostingerId]) . " imagen(es) para ID=$hostingerId");
                    $dbLocal->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?')->execute([$hostingerId]);
                    $imgIns = $dbLocal->prepare('INSERT INTO producto_imagenes (producto_id, imagen_url, public_id, description) VALUES (?, ?, ?, ?)');
                    foreach ($imageMap[$hostingerId] as $img) {
                        $imgIns->execute([$hostingerId, $img['url'], $img['public_id'], $img['description']]);
                    }
                } else {
                    Logger::info("    ℹ️ Sin imágenes para ID=$hostingerId");
                }

                // Sincronizar variantes
                if (isset($varMap[$hostingerId])) {
                    Logger::info("    📐 Sincronizando " . count($varMap[$hostingerId]) . " variante(s) para ID=$hostingerId");
                    $dbLocal->prepare('DELETE FROM producto_variantes WHERE producto_id = ?')->execute([$hostingerId]);
                    $varIns = $dbLocal->prepare('INSERT INTO producto_variantes (producto_id, nombre, disponible, precio) VALUES (?, ?, ?, ?)');
                    foreach ($varMap[$hostingerId] as $var) {
                        $varIns->execute([$hostingerId, $var['name'], (int)($var['available'] ?? 0), $var['price'] ?? 0]);
                    }
                }

                // Sincronizar colores
                if ($tieneColores && isset($colorMap[$hostingerId])) {
                    Logger::info("    🎨 Sincronizando " . count($colorMap[$hostingerId]) . " color(es) para ID=$hostingerId");
                    $dbLocal->prepare('DELETE FROM producto_colores WHERE producto_id = ?')->execute([$hostingerId]);
                    $colIns = $dbLocal->prepare('INSERT INTO producto_colores (producto_id, color) VALUES (?, ?)');
                    foreach ($colorMap[$hostingerId] as $color) {
                        $colIns->execute([$hostingerId, $color]);
                    }
                }
            }

            $dbLocal->commit();
            Logger::info("✅ Transacción confirmada. Importados: $importados | Actualizados: $actualizados");

            Response::success([
                'status'      => 'success',
                'mensaje'     => 'Importación completada con éxito',
                'importados'  => $importados,
                'actualizados' => $actualizados
            ]);

        } catch (Throwable $e) {
            if (isset($dbLocal) && $dbLocal->inTransaction()) {
                $dbLocal->rollBack();
                Logger::error("↩️ Transacción revertida.");
            }
            Logger::error("❌ Error fatal en ejecutarImportacion(): " . $e->getMessage());
            Logger::error("📍 Traza: " . $e->getTraceAsString());
            Response::error('Error fatal durante la importación: ' . $e->getMessage(), 500);
        }
    }

    public static function obtenerVistaPrevia(): void {
        Logger::info("🔍 Obteniendo vista previa de productos desde Hostinger...");

        try {
            $dbHostinger = Database::getHostingerConnection();

            $stmt = $dbHostinger->query("SELECT * FROM products WHERE deleted_at IS NULL AND category='Espumas'");
            $productsHostinger = $stmt->fetchAll();
            Logger::info("📦 Vista previa: " . count($productsHostinger) . " producto(s) encontrados.");

            if (empty($productsHostinger)) {
                Response::success(['productos' => []]);
                return;
            }

            $ids = array_column($productsHostinger, 'id');
            $idsPlaceholders = implode(',', array_fill(0, count($ids), '?'));

            // Imágenes
            $imgStmt = $dbHostinger->prepare("SELECT product_id, url, description FROM product_images WHERE product_id IN ($idsPlaceholders)");
            $imgStmt->execute($ids);
            $allImages = $imgStmt->fetchAll();

            $imageMap = [];
            foreach ($allImages as $img) {
                $pid = $img['product_id'];
                $url = $img['url'];
                if (isset($imageMap[$pid])) {
                    $urlsYaProcesadas = array_column($imageMap[$pid], 'url');
                    if (in_array($url, $urlsYaProcesadas)) continue;
                }
                $imageMap[$pid][] = [
                    'url' => $url,
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

            // Colores
            $colorMap = [];
            try {
                $colStmt = $dbHostinger->prepare("SELECT product_id, color FROM product_colors WHERE product_id IN ($idsPlaceholders)");
                $colStmt->execute($ids);
                $allColors = $colStmt->fetchAll();
                foreach ($allColors as $col) {
                    $colorMap[$col['product_id']][] = $col['color'];
                }
            } catch (Throwable $e) {
                Logger::warning("⚠️ Colores no disponibles en vista previa: " . $e->getMessage());
            }

            $preview = [];
            foreach ($productsHostinger as $product) {
                $hostingerId = (int)$product['id'];
                $preview[] = [
                    'id'         => $hostingerId,
                    'nombre'     => $product['name'],
                    'descripcion' => $product['description'],
                    'categoria'  => $product['category'],
                    'marca'      => $product['marca'],
                    'imagenes'   => $imageMap[$hostingerId] ?? [],
                    'variantes'  => $varMap[$hostingerId] ?? [],
                    'colores'    => $colorMap[$hostingerId] ?? []
                ];
            }

            Response::success(['productos' => $preview]);

        } catch (Throwable $e) {
            Logger::error("❌ Error en obtenerVistaPrevia(): " . $e->getMessage());
            Response::error('Error al obtener la vista previa: ' . $e->getMessage(), 500);
        }
    }

    private static function resolverSubcategoria(PDO $db, string $categoryName): int {
        // Buscar o crear categoría en la BD local
        $stmt = $db->prepare("SELECT id FROM categorias WHERE nombre = ? LIMIT 1");
        $stmt->execute([$categoryName]);
        $cat = $stmt->fetch();

        if ($cat) {
            $catId = (int)$cat['id'];
            Logger::info("      📁 Categoría '$categoryName' encontrada (ID=$catId)");
        } else {
            $db->prepare("INSERT INTO categorias (nombre) VALUES (?)")->execute([$categoryName]);
            $catId = (int)$db->lastInsertId();
            Logger::info("      📁 Categoría '$categoryName' creada (ID=$catId)");
        }

        // Buscar o crear subcategoría 'General' vinculada a esta categoría
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
