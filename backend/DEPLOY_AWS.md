# 🚀 Deployment a AWS Elastic Beanstalk

## Requisitos Previos

1. **AWS Account** - Crea una cuenta en [AWS](https://aws.amazon.com)
2. **AWS CLI** - Instala desde [aquí](https://aws.amazon.com/es/cli/)
3. **EB CLI** - Instala con:
   ```bash
   pip install awsebcli --upgrade --user
   ```
4. **Git** - Inicializa el repositorio si no lo has hecho
5. **Node.js 20+** - Asegúrate de tener la versión correcta

## Variables de Entorno

Asegúrate de que tu `.env` tenga estas variables (no será subido a EB):
```
PORT=8080
NODE_ENV=production
DB_HOST=tu_rds_host
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_database
JWT_SECRET=tu_secret_key
CLOUDINARY_NAME=tu_cloudinary
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Pasos para Desplegar

### 1. Configurar AWS CLI
```bash
aws configure
# Ingresa tu Access Key ID, Secret Access Key, región (sa-east-1), output format (json)
```

### 2. Inicializar Elastic Beanstalk (solo primera vez)
```bash
cd backend
eb init -p "Node.js 20 running on 64bit Amazon Linux 2023" espumasytasticos-backend --region sa-east-1
```

### 3. Crear y Desplegar el Entorno
```bash
# Crear entorno de producción
eb create espumas-prod

# O si ya existe, actualizar:
eb deploy espumas-prod
```

### 4. Configurar Variables de Entorno en EB
```bash
# Abrir la consola web y configurar las variables, o:
eb setenv \
  DB_HOST=tu_rds_host \
  DB_PORT=3306 \
  DB_USER=tu_usuario \
  DB_PASSWORD=tu_password \
  DB_NAME=tu_database \
  JWT_SECRET=tu_secret \
  CLOUDINARY_NAME=tu_cloudinary \
  CLOUDINARY_API_KEY=tu_key \
  CLOUDINARY_API_SECRET=tu_secret
```

### 5. Desplegar Cambios Futuros
```bash
# Desde la carpeta backend
eb deploy
# o especificar el entorno:
eb deploy espumas-prod
```

## Comandos Útiles

```bash
# Ver estado del entorno
eb status

# Ver logs en tiempo real
eb logs

# Abrir en navegador
eb open

# Eliminar entorno
eb terminate espumas-prod

# Listar entornos
eb list

# SSH a la instancia
eb ssh espumas-prod
```

## Verificar Deployment

Una vez desplegado, verifica que todo funciona:
```bash
# Health check
curl https://tu-url-de-eb.sa-east-1.elasticbeanstalk.com/health

# Tus rutas API
curl https://tu-url-de-eb.sa-east-1.elasticbeanstalk.com/api/categoria
```

## Diferenciarse de Plaxtilineas

Este proyecto está configurado como:
- **Application:** `espumasytasticos-backend`
- **Environment:** `espumas-prod`
- **Region:** `sa-east-1` (No cambiar sin coordinación)
- **Platform:** Node.js 20 en Amazon Linux 2023

Son espacios completamente separados en AWS, sin conflicto con Plaxtilineas.

## Troubleshooting

Si EB no inicia correctamente:
```bash
# Ver logs detallados
eb logs -v

# Tail de logs
eb logs --stream

# Ver eventos
eb events -f
```

Si necesitas volver a una versión anterior:
```bash
eb appversion list
eb deploy --version=<previous_version_label>
```

## Notas de Seguridad

- ✅ El `.ebignore` excluye `.env` automáticamente
- ✅ Las variables sensibles deben configurarse en EB Console o `eb setenv`
- ✅ Usa RDS (Relational Database Service) en lugar de MySQL local
- ✅ Configura Security Groups correctamente en AWS
