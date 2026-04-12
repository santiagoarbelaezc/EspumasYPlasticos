# 🎯 ACCIÓN INMEDIATA - ERROR 500 EN HOSTINGER

## ⚡ Resumen de 30 Segundos

**Problema**: Error 500 al hacer login en `/api/auth/login`

**Causa**: Las carpetas en Hostinger están en minúsculas (`controllers`) pero el código busca CamelCase (`Controllers`). En Linux (Hostinger) esto importa, en Windows no.

**Solución**: 2 opciones

---

## ✅ OPCIÓN 1: VÍA FILE MANAGER (MÁS FÁCIL)

1. Abre Hostinger → File Manager
2. Navega a `/public_html/api/`
3. Si ves estas carpetas renombralas así:
   - `controllers` → renombra a → `Controllers`
   - `config` → renombra a → `Config`
   - `utils` → renombra a → `Utils`
   - `middleware` → renombra a → `Middleware`

4. **Listo** ✅

---

## ✅ OPCIÓN 2: VÍA TERMINAL (RÁPIDO)

Si tienes SSH en Hostinger:

```bash
cd ~/public_html/api
mv controllers Controllers 2>/dev/null
mv config Config 2>/dev/null
mv utils Utils 2>/dev/null
mv middleware Middleware 2>/dev/null
ls -la  # Verificar
```

---

## 🧪 VERIFICAR QUE FUNCIONÓ

Accede a estas URLs para confirmar:

### 1️⃣ Diagnóstico Avanzado
```
https://espumasyplasticos.com/api/diagnostico-avanzado.php
```

Busca en el JSON:
```json
"Controllers": {
  "exists": true  ← Debe ser true
},
"Config": {
  "exists": true  ← Debe ser true
}
```

Si todos dicen `true`, **continúa al paso 2**.

### 2️⃣ Test de Login Directo
```
https://espumasyplasticos.com/api/test-login-directo.php
```

Busca:
```json
"status": "SUCCESS ✅"
```

Si ves eso, **el backend está listo**.

### 3️⃣ Prueba el Login Real
Desde tu Angular app, intenta:
- Email: `admin@espumasyplasticos.com`
- Contraseña: (la que hayas configurado)

Debería funcionar ✅

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, ver:
- **[DEPLOYMENT_HOSTINGER.md](./DEPLOYMENT_HOSTINGER.md)** - Guía completa de deployment
- **[HOSTINGER_ERROR_500_FIX.md](./HOSTINGER_ERROR_500_FIX.md)** - Solución detallada del error 500

---

## 🆘 SI SIGUE SIN FUNCIONAR

1. Accede a `diagnostico-avanzado.php`
2. Busca líneas rojas (❌) o "NO"
3. Copia-pega la respuesta del JSON para debugging

---

**Tiempo estimado:** 5 minutos  
**Dificultad:** Muy fácil (solo renombrar 4 carpetas)
