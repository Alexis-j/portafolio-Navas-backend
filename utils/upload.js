import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(path.resolve(), "uploads");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/* ======================================================
   🔵 FUNCIÓN PARA LIMPIAR NOMBRES DE ARCHIVO
====================================================== */
const cleanFilename = (originalname) => {
  return originalname
    .toLowerCase()
    .replace(/\s+/g, "-")           // espacios → guiones
    .replace(/[^a-z0-9.-]/g, "")    // caracteres raros fuera
    .replace(/-+/g, "-");           // guiones dobles
};

/* ======================================================
   🟢 STORAGE DISK (uploads normales)
====================================================== */
export const storageDisk = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const cleanName = cleanFilename(name);

    cb(null, `${Date.now()}-${cleanName}${ext}`);
  },
});

export const uploadDisk = multer({ storage: storageDisk });

/* ======================================================
   🟣 STORAGE MEMORY (para Sharp)
====================================================== */
export const storageMemory = multer.memoryStorage();
export const uploadMemory = multer({ storage: storageMemory });

/* ======================================================
   🟡 RESIZE CON SHARP
====================================================== */
export const resizeImages = (fieldsConfig) => async (req, res, next) => {
  try {
    if (!req.files) return next();

    const resizeField = async (field, width, height, fit = "cover") => {
      if (!req.files[field]) return;

      const file = req.files[field][0];
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const cleanName = cleanFilename(name);

      const filename = `${field}-${Date.now()}-${cleanName}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      await sharp(file.buffer)
        .resize(width, height, { fit })
        .toFile(filepath);

      // Sobrescribimos el filename para que el controller lo use
      req.files[field][0].filename = filename;
    };

    const tasks = fieldsConfig.map((f) =>
      resizeField(f.name, f.width, f.height, f.fit)
    );

    await Promise.all(tasks);
    next();
  } catch (err) {
    console.error("Error resizing images:", err);
    res.status(500).json({ error: "Error processing images" });
  }
};
