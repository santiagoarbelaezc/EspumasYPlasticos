const express = require('express');
const cors = require('cors');
const path = require('path');

// 🔌 Inicializar app
const app = express();
const PORT = process.env.PORT || 3000;

// 📦 Middleware
app.use(cors());
app.use(express.json());

// 🔁 Rutas API
// =========================
// Importar y usar las rutas con namespace
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/producto.routes');
const subcategoria = require('./routes/subcategoria.routes');
const categoria = require('./routes/categoria.routes');

app.use('/api/auth', authRoutes);
app.use('/api/producto', productRoutes);
app.use('/api/subcategoria', subcategoria);
app.use('/api/categoria', categoria);

// 🏥 Health check endpoint para Elastic Beanstalk
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy' });
});

const fs = require('fs');

// 🌐 Servir Angular compilado solo si existe (evita errores en desarrollo)
const angularPath = path.join(__dirname, '../frontend/dist/frontend');
app.use(express.static(angularPath));

// 🏠 Ruta SPA: solo si frontend existe y contiene index.html
if (fs.existsSync(path.join(angularPath, 'index.html'))) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(angularPath, 'index.html'));
  });
} else {
  console.warn('⚠️  Angular no compilado: No se registró la ruta SPA catch-all.');
}


// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log('========================================\n');
});