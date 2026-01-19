import aboutRoutes from "./routes/about.js";
import adminRoutes from './routes/admin.js';
import contactRoutes from "./routes/contactRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import galleryRoutes from './routes/galleryRoutes.js';
import heroRoutes from './routes/hero.js';
import paquetesRoutes from './routes/paquete.js';
import path from 'path';
import reviewsRoutes from "./routes/reviewsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));

app.use(express.json());

// Servir archivos estáticos de /uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));


// Rutas API
app.use('/api/hero', heroRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/admin', adminRoutes); // 👈 esta es la buena

app.use("/api/about", aboutRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
