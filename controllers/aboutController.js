import {
  createAboutDB,
  getAboutDB,
  updateAboutDB
} from "../models/about.js";

import cloudinary from "../utils/cloudinary.js";

/* ================= GET ================= */
export const getAbout = async (req, res) => {
  try {
    const about = await getAboutDB();
    res.json(about);
  } catch (err) {
    console.error("Error en getAbout:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

console.log("Cloudinary cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);

/* ================= CREATE ================= */
export const createAbout = async (req, res) => {
  try {
    console.log("POST /about req.body:", req.body);
    console.log("POST /about req.files:", req.files);

    const uploadToCloud = async (file, folder = "about_images") => {
      if (!file) return null;
      const result = await cloudinary.uploader.upload(file.path, { folder });
      console.log("Subida a Cloudinary:", result.secure_url);
      return result.secure_url;
    };

    const imagenLight = await uploadToCloud(req.files?.imagen_light?.[0]);
    const imagenDark = await uploadToCloud(req.files?.imagen_dark?.[0]);

    const nuevo = await createAboutDB(
      req.body.titulo,
      req.body.descripcion,
      imagenLight,
      imagenDark
    );

    console.log("About creado:", nuevo);
    res.json({ message: "About creado ✅", about: nuevo });
  } catch (err) {
    console.error("Error createAbout:", err);
    res.status(500).json({ error: "Error al crear about" });
  }
};

/* ================= UPDATE ================= */
export const updateAbout = async (req, res) => {
  try {
    console.log("PUT /about req.body:", req.body);
    console.log("PUT /about req.files:", req.files);

    const existing = await getAboutDB();
    if (!existing) return res.status(404).json({ error: "No existe about" });

    console.log("Existing about:", existing);

    const uploadAndReplace = async (field, existingUrl) => {
      if (!req.files?.[field]?.[0]) return existingUrl;

      // Borrar imagen previa si existe
      if (existingUrl) {
        try {
          const publicId = existingUrl.split("/").pop().split(".")[0];
          console.log(`Borrando ${field} en Cloudinary: about_images/${publicId}`);
          await cloudinary.uploader.destroy(`about_images/${publicId}`);
        } catch (err) {
          console.warn(`No se pudo borrar ${field}:`, err.message);
        }
      }

      // Subir nueva imagen
      const result = await cloudinary.uploader.upload(req.files[field][0].path, {
        folder: "about_images",
      });
      console.log(`Subida ${field} a Cloudinary:`, result.secure_url);
      return result.secure_url;
    };

    const imagenLight = await uploadAndReplace("imagen_light", existing.imagen_light);
    const imagenDark = await uploadAndReplace("imagen_dark", existing.imagen_dark);

    const updated = await updateAboutDB(
      req.body.titulo ?? existing.titulo,
      req.body.descripcion ?? existing.descripcion,
      imagenLight,
      imagenDark,
      existing.id
    );

    console.log("About actualizado:", updated);
    res.json({ message: "About actualizado ✅", about: updated });
  } catch (err) {
    console.error("Error updateAbout:", err);
    res.status(500).json({ error: "Error al actualizar about" });
  }
};
