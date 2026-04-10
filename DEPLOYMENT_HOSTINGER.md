# 🚀 GUÍA DEPLOYMENT HOSTINGER - Backend PHP

## 📋 Checklist Antes de Subir a Producción

### 1. **Verificar Configuración Local**
- [ ] El backend funciona en `http://localhost:8000`
- [ ] Todos los endpoints responden correctamente
- [ ] Las imágenes se suben a Cloudinary sin errores
- [ ] Las validaciones están activas (sin precios/cantidades negativas)

### 2. **Preparar Archivos para Hostinger**

#### A. Instalar Dependencias Composer
```bash
cd backend-php
composer install
```
Este comando genera la carpeta `/vendor` con todas las dependencias.

#### B. Crear Variables de Entorno
```bash
# Copiar .env.example a .env
cp .env.example .env

# Editar .env con valores de producción
# - Database credentials
# - Cloudinary keys
# - APP_ENV=production
```

**Valores importantes para .env:**
```env
APP_ENV=production
APP_DEBUG=false

# Database (Hostinger proporciona estos datos en el panel de control)
DB_HOST=localhost
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_NAME=tu_base_datos

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Logging
LOG_FILE=/home/tu_usuario/logs/backend.log
```

### 3. **Carpetas a Subir a Hostinger**

Sube TODO ESTO a `/home/tu_usuario/public_html/api/`:

```
backend-php/
├── vendor/              ← Carpeta de composer (IMPORTANTE)
├── config/
├── controllers/
├── middleware/
├── routes/
├── utils/
├── logs/                ← Crear si no existe (permisos 755)
├── .env                 ← Archivo de configuración
├── .htaccess            ← Reescritura de URLs
├── index.php            ← Punto de entrada
└── (otros archivos)
```

### 4. **Verificar Permisos en Hostinger**

En el **File Manager** de Hostinger:

1. Panel → File Manager
2. Selecciona la carpeta `/api/`
3. Cambia permisos:
   - Carpeta `/api/`: `755`
   - Carpeta `/logs/`: `755` (debe ser escribible)
   - Archivos `.php`: No necesitan cambio
   - `.htaccess`: `644`

### 5. **Verificar Configuración Apache**

Para que mod_rewrite funcione en Hostinger:

1. Panel de Control → Configuración
2. Busca "mod_rewrite" y verifica que esté **habilitado**
3. Si no está habilitado, contacta a soporte de Hostinger

**O prueba con este .htaccess alternativo:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

### 6. **Verificar Diagnostico**

Una vez subido a Hostinger:

1. Accede a: `http://tudominio.com/api/diagnostico.php`
2. Revisa los problemas reportados:
   - ✅ mod_rewrite habilitado
   - ✅ vendor existe
   - ✅ logs es escribible
   - ✅ .env existe
   - Todos los extensions de PHP

### 7. **Pruebas Endpoint a Endpoint**

Después de subir, prueba los endpoints:

```bash
# Desde PowerShell (Windows)

# 1. Health check
curl -X GET "http://tudominio.com/api/health"

# 2. Obtener categorías
curl -X GET "http://tudominio.com/api/categoria"

# 3. Obtener productos
curl -X GET "http://tudominio.com/api/producto"

# 4. Crear categoría (test)
curl -X POST "http://tudominio.com/api/categoria" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\": \"Test\", \"descripcion\": \"Test\"}"

# 5. Obtener logs
curl -X GET "http://tudominio.com/read_log.php"
```

### 8. **Problemas Comunes en Hostinger**

#### ❌ Error 404 en todas las rutas (excepto index.php)
**Causa**: mod_rewrite no habilitado o .htaccess incorrecto
**Solución**:
- Contacta Hostinger para habilitar mod_rewrite
- Verifica que el .htaccess está en la carpeta correcta

#### ❌ Error 500 en endpoints
**Causa**: .env incorrecto o credentials de BD
**Solución**:
- Accede a `diagnostico.php` para ver errores
- Verifica credenciales de BD en el panel de Hostinger
- Revisa los logs en `/logs/`

#### ❌ Las imágenes no suben
**Causa**: Cloudinary keys incorrecto u permisos de carpeta
**Solución**:
- Verifica que CLOUDINARY_* en .env sean correctas
- Cambia permisos de carpeta `/api/` a `755`

#### ❌ Base de datos vacía
**Causa**: No importaste el schema SQL
**Solución**:
- Panel de Hostinger → MySQL → phpMyAdmin
- Importa el script: `backend-php/initialize_db.php`
- O ejecuta manualmente los CREATE TABLE

### 9. **Activar HTTPS en Hostinger**

1. Panel → SSL/TLS
2. Instala certificado gratuito (Let's Encrypt)
3. Força HTTPS en el .htaccess:

```apache
# Forzar HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

### 10. **Verificar Domain Pointing**

Asegúrate que el dominio apunta a Hostinger:

1. Proveedor de dominio → DNS
2. Nameservers deben ser:
   - `ns1.hostinger.com`
   - `ns2.hostinger.com`
3. Espera 24-48 horas para propagación

---

## 🔄 Flujo Completo

1. **Localmente**:
   - `composer install` 
   - Copiar `.env.example` → `.env`
   - Probar endpoints

2. **En Hostinger**:
   - File Manager → Subir carpeta `/api/`
   - Cambiar permisos (755 para carpetas, 644 para archivos)
   - Acceder a `/diagnostico.php` para verificar

3. **Actualizar Frontend**:
   - `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiURL: 'https://tudominio.com/api'
   };
   ```
   - Build: `ng build --configuration production`

4. **Testing**:
   - Usar `test-put-update.php` para probar actualización
   - Crear/editar productos desde dashboard

---

## 📞 Soporte Hostinger

Si tienes problemas:
1. Accede a `https://tudominio.com/api/diagnostico.php`
2. Busca los errores reportados
3. Contacta a soporte de Hostinger mencionando:
   - El error o código HTTP
   - Resultado del `/diagnostico.php`
   - Qué endpoint es problemático

---

## ✅ Verificación Final

```
✅ Backend funciona en localhost:8000
✅ Archivos subidos a Hostinger
✅ permisos correctos (755, 644)
✅ .env con credenciales correctas
✅ Cloudinary API keys válidas
✅ Database schema importado
✅ diagnostico.php muestra todo OK
✅ Endpoints responden sin error 404
✅ HTTPS activado
✅ Frontend apunta a api.tudominio.com
✅ Las imágenes se suben sin errores
```

Si todo ✅, ¡Tu backend está listo para producción! 🚀
