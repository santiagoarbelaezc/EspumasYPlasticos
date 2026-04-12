#!/bin/bash
# 🧪 VERIFICACIÓN LOCAL ANTES DE SUBIR A HOSTINGER
# Ejecutar: bash check-before-deploy.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 VERIFICACIÓN PRE-DEPLOYMENT - Backend PHP${NC}\n"

ERRORS=0
WARNINGS=0

# Función para verificar
check() {
    if [ -d "$1" ] || [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# Cambiar al directorio backend-php
if [ ! -d "backend-php" ]; then
    echo -e "${RED}❌ Debes ejecutar esto desde la raíz del proyecto (donde está backend-php/)${NC}\n"
    exit 1
fi

cd backend-php

echo -e "${BLUE}📁 Verificando estructura de carpetas...${NC}\n"

# Verificar carpetas IMPORTANTES
check "Controllers/" "Controllers/ existe"
check "Config/" "Config/ existe"
check "Utils/" "Utils/ existe"
check "Middleware/" "Middleware/ existe"
check "routes/" "routes/ existe"
check "vendor/" "vendor/ existe (composer packages)"
check "logs/" "logs/ existe"

echo ""
echo -e "${BLUE}📄 Verificando archivos críticos...${NC}\n"

check ".env" ".env existe con credenciales"
check ".htaccess" ".htaccess existe para reescritura de URLs"
check "composer.json" "composer.json existe"
check "index.php" "index.php existe (punto de entrada)"

echo ""
echo -e "${BLUE}🔤 Verificando Namespaces en código...${NC}\n"

# Buscar namespaces incorrectos
if grep -r "App\\\\controllers" . --include="*.php" 2>/dev/null | grep -v vendor > /dev/null; then
    warn "Encontrado 'App\\\\controllers' (minúscula) - Debería ser 'App\\\\Controllers'"
fi

if grep -r "App\\\\utils" . --include="*.php" 2>/dev/null | grep -v vendor > /dev/null; then
    warn "Encontrado 'App\\\\utils' (minúscula) - Debería ser 'App\\\\Utils'"
fi

if grep -r "App\\\\config" . --include="*.php" 2>/dev/null | grep -v vendor > /dev/null; then
    warn "Encontrado 'App\\\\config' (minúscula) - Debería ser 'App\\\\Config'"
fi

echo ""
echo -e "${BLUE}🔗 Verificando URLs en test files...${NC}\n"

if grep -r "localhost:8000" test-*.php 2>/dev/null | head -3; then
    warn "Encontradas referencias a localhost:8000. En producción usar el dominio real."
fi

echo ""
echo -e "${BLUE}✅ Verificación de Composer...${NC}\n"

if [ -f "composer.lock" ]; then
    echo -e "${GREEN}✅${NC} composer.lock existe"
else
    warn "composer.lock no existe. Ejecuta: composer install"
fi

echo ""
echo -e "${BLUE}📦 Tamaño de carpeta vendor...${NC}\n"

if [ -d "vendor" ]; then
    SIZE=$(du -sh vendor | cut -f1)
    echo "📊 vendor/ = $SIZE (asegúrate de subir esta carpeta completa a Hostinger)"
fi

echo ""
echo -e "${BLUE}🗂️ Estructura final esperada en Hostinger:${NC}\n"

cat << 'EOF'
/public_html/api/
├── Controllers/
├── Config/
├── Utils/
├── Middleware/
├── routes/
├── vendor/           ← IMPORTANTE: Subir completo
├── logs/             ← Permisos 755
├── .env              ← Con credenciales correctas
├── .htaccess         ← Reescritura de URLs
├── index.php         ← Punto de entrada
├── diagnostico-avanzado.php   ← Para debug
└── test-login-directo.php     ← Para debug
EOF

echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}\n"

echo -e "1. Sube TODO el contenido de backend-php/ a Hostinger en /public_html/api/"
echo -e "2. Verifica que las carpetas tengan los nombres EXACTOS en MAYÚSCULA"
echo -e "3. Cambia permisos:"
echo -e "   • /api/ = 755"
echo -e "   • /api/logs/ = 755"
echo -e "   • Archivos .php = 644"
echo -e "4. Accede a /api/diagnostico-avanzado.php para verificar"
echo -e "5. Si tienes errores 500, accede a /api/test-login-directo.php\n"

echo -e "${BLUE}========================================${NC}"
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ ERRORES: $ERRORS${NC}"
    echo -e "Soluciona estos errores antes de subir a Hostinger"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️ ADVERTENCIAS: $WARNINGS${NC}"
    echo -e "Revisa estas advertencias antes de subir"
    exit 0
else
    echo -e "${GREEN}✅ TODO OK - Listo para subir a Hostinger${NC}"
    exit 0
fi
