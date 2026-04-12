# 🆘 ERROR 500 EN HOSTINGER - SOLUCIÓN RÁPIDA

## ❌ El Problema

Cuando subes el backend a Hostinger y haces una petición a `/api/auth/login` devuelve error **500 Internal Server Error**.

## ✅ La Solución es Sencilla: MAYÚSCULAS

### 🔴 ESTO NO FUNCIONA EN HOSTINGER:
```
/public_html/api/
├── controllers/      ← ❌ MINÚSCULAS (no funciona en Linux)
├── config/           ← ❌ MINÚSCULAS
├── utils/            ← ❌ MINÚSCULAS
└── middleware/       ← ❌ MINÚSCULAS
```

### 🟢 ESTO SÍ FUNCIONA:
```
/public_html/api/
├── Controllers/      ← ✅ MAYÚSCULAS (CamelCase)
├── Config/           ← ✅ MAYÚSCULAS
├── Utils/            ← ✅ MAYÚSCULAS
└── Middleware/       ← ✅ MAYÚSCULAS
```

## 🔧 Cómo Arreglarlo en Hostinger

### Opción 1: File Manager (Manual - Más Fácil)

1. Entra al **File Manager** de Hostinger
2. Navega a `/public_html/api/`
3. Si ves carpetas en minúsculas (`controllers`, `config`, etc.), **renombralas a CamelCase**:
   - `controllers` → `Controllers` (clic derecho → Rename)
   - `config` → `Config`
   - `utils` → `Utils`
   - `middleware` → `Middleware`

4. Guarda cambios

### Opción 2: Terminal (Rápido)

Si tienes acceso a terminal SSH en Hostinger:

```bash
cd ~/public_html/api

# Renombrar carpetas
mv controllers Controllers 2>/dev/null || mv Controllers Controllers
mv config Config 2>/dev/null || mv Config Config
mv utils Utils 2>/dev/null || mv Utils Utils
mv middleware Middleware 2>/dev/null || mv Middleware Middleware

# Verificar
ls -la
```

## ✅ Verificar que Funcionó

Después de renombrar, accede a:

```
https://espumasyplasticos.com/api/diagnostico-avanzado.php
```

Esto te mostrará un JSON con el estado de todo. Busca:
- `"Controllers"` → debe decir `"exists": true`
- `"Config"` → debe decir `"exists": true`
- `"Utils"` → debe decir `"exists": true`
- `"Middleware"` → debe decir `"exists": true`

Si todos dicen `true`, **ya funciona** ✅

## 🧪 Probar el Login

Una vez que las carpetas estén renombradas, accede a:

```
https://espumasyplasticos.com/api/test-login-directo.php
```

Si ves `"status": "SUCCESS ✅"`, entonces el backend está listo.

Intenta el login en el frontend:
- Email: `admin@espumasyplasticos.com`
- Contraseña: (la que hayas configurado en la BD)

## 📝 POR QUÉ PASA ESTO

- **Windows** (tu computadora local): Las carpetas son **insensibles a mayúsculas**
  - Así que `controllers` = `Controllers` = `CONTROLLERS`
  - Todo funciona

- **Linux** (Hostinger): Las carpetas son **sensibles a mayúsculas**
  - `controllers` ≠ `Controllers` ≠ `CONTROLLERS`
  - El código busca `App\Controllers` pero si la carpeta se llama `controllers`, **no la encuentra**
  - Resultado: **error 500**

## 🆘 Si Sigue sin Funcionar

1. Accede a `https://espumasyplasticos.com/api/diagnostico-avanzado.php`
2. Busca cualquier línea con `✅` que sea `false` o `NO`
3. Manda la respuesta completa a soporte

*Ejemplo:*
```json
{
  "file_system": {
    "Controllers": {
      "exists": false  ← AQUÍ ESTÁ EL PROBLEMA
    }
  }
}
```

## ✨ Una Vez Solucionado

Todo debería funcionar perfectamente:
- ✅ Login funciona
- ✅ Crear productos con imágenes funciona
- ✅ Actualizar productos funciona
- ✅ Las imágenes se suben a Cloudinary correctamente

---

**Tiempo estimado para resolver:** 2-5 minutos

**Dificultad:** Muy fácil (solo renombrar carpetas)
