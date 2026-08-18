<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0056b3,100:001f3f&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">🛋️ Espumas y Plásticos</h1>

<h3 align="center">🏭 Plataforma Web de Catálogo, Productos e Información Corporativa</h3>

<p align="center">
  Aplicación web integral para la empresa Espumas y Plásticos.<br>
  Frontend desacoplado en Angular con Server-Side Rendering (SSR) y Backend REST API desarrollado en PHP puro.
</p>

---

## 🎯 **Descripción**

**Espumas y Plásticos** es un sistema web completo diseñado para exhibir la línea de productos, brindar información sobre la empresa y gestionar el catálogo mediante una API RESTful. La arquitectura está dividida en un cliente de interfaz moderna en **Angular (v21)** y un servidor backend ligero en **PHP 8+** con integración a base de datos MySQL, almacenamiento multimedia en Cloudinary y autenticación basada en JSON Web Tokens (JWT).

---

## ✨ **Características Principales**

### **🛍️ Catálogo & Productos**
- **Explorador por Categorías:** Navegación fluida por categorías y subcategorías de productos.
- **Vistas en Grid:** Muestrario interactivo con filtros, imágenes y descripciones detalladas.
- **Importación Masiva:** Herramientas para carga masiva de inventario y datos.

### **🏢 Presencia Corporativa**
- **Sección Institucional:** Misión, visión, línea de tiempo e historia de la compañía.
- **Información Operativa:** Horarios de atención, ubicación interactiva y directorio de empleados.
- **Red de Aliados:** Exhibición de socios comerciales y marcas aliadas.

### **🔐 Administración & Autenticación**
- **Autenticación JWT:** Sistema de login seguro para administradores.
- **Middlewares de Seguridad:** Validación de tokens de acceso y protección de rutas.

### **💬 Atención al Cliente & Canales de Contacto**
- **Gestión de PQRS:** Formulario para peticiones, quejas, reclamos y sugerencias.
- **Contacto Directo:** Enlace rápido e integración con botón flotante de WhatsApp.

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
<div align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
</div>

### **Backend API**
<div align="center">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</div>

### **UI/UX & Despliegue**
<div align="center">
  <img src="https://img.shields.io/badge/FontAwesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/SweetAlert2-8CD4F5?style=for-the-badge&logo=sweetalert2&logoColor=black" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</div>

---

## 📂 **Estructura del Proyecto**

```text
EspumasYPlasticos/
├── backend-php/              # Backend API en PHP Puro
│   ├── config/               # Configuración de base de datos y Cloudinary
│   ├── controllers/          # Controladores (Auth, Categorías, Productos, etc.)
│   ├── middleware/           # Middlewares de autenticación y carga de archivos
│   ├── routes/               # Enrutamiento API REST
│   ├── utils/                # Respuestas HTTP, peticiones y logger
│   ├── .env.example          # Plantilla de variables de entorno (sin credenciales)
│   ├── composer.json         # Dependencias PHP
│   └── index.php             # Punto de entrada principal de la API REST
│
└── frontend/                 # Aplicación de cliente en Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Componentes de UI (Grid de productos, PQRS, WhatsApp, etc.)
    │   │   ├── pages/        # Páginas principales (Home, Productos, Nosotros, Contacto, Admin)
    │   │   ├── services/     # Servicios HTTP para conexión con la API REST
    │   │   ├── guards/       # Guardianes de navegación
    │   │   └── interceptors/ # Interceptores HTTP
    ├── angular.json          # Configuración del proyecto Angular
    ├── firebase.json         # Configuración de despliegue en Firebase Hosting
    └── package.json          # Dependencias y scripts del frontend
```

---

## 🚀 **Instalación y Configuración**

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/santiagoarbelaezc/EspumasYPlasticos.git
cd EspumasYPlasticos
```

### 2. **Configuración del Backend (PHP)**
```bash
cd backend-php
composer install
```
- Copia el archivo `.env.example` a `.env` y configura las variables de entorno para la base de datos y Cloudinary:
```bash
cp .env.example .env
```
- Inicia el servidor de desarrollo en PHP:
```bash
php -S localhost:8000
```

### 3. **Configuración del Frontend (Angular)**
```bash
cd ../frontend
npm install
npm start
```
Abre tu navegador en `http://localhost:4200/`.

---

## 👨‍💻 **Desarrollador**

<div align="center">
  <h3>Santiago Arbelaez Contreras</h3>
  <p>Junior Full Stack Developer<br>Estudiante de Ingeniería de Sistemas – Universidad del Quindío</p>

  <a href="https://github.com/santiagoarbelaezc">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://portfolio-santiagoa.web.app/portfolio">
    <img src="https://img.shields.io/badge/Portfolio-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white" />
  </a>
</div>

<br>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0056b3,100:001f3f&height=90&section=footer&animation=fadeIn" />
</div>
