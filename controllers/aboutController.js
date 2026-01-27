import {
  createAboutDB,
  getAboutDB,
  updateAboutDB
} from "../models/about.js";

import { cloudinary } from "../utils/cloudinary.js"; // tu configuración de Cloudinary

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
  const { titulo, descripcion } = req.body;

  const uploadFile = async (file) => {
    if (!file) return null;
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "about_images",
    });
    return result.secure_url;
  };

  try {
    const imagenLight = await uploadFile(req.files?.imagen_light?.[0]);
    const imagenDark = await uploadFile(req.files?.imagen_dark?.[0]);

    const nuevo = await createAboutDB(titulo, descripcion, imagenLight, imagenDark);
    res.json({ message: "About creado ✅", about: nuevo });
  } catch (err) {
    console.error("Error createAbout:", err);
    res.status(500).json({ error: "Error al crear about" });
  }
};

/* ================= UPDATE ================= */
export const updateAbout = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    const existing = await getAboutDB();
    if (!existing) return res.status(404).json({ error: "No existe about" });

    const uploadAndReplace = async (field, existingUrl) => {
      if (req.files?.[field]) {
        if (existingUrl) {
          const publicId = existingUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`about_images/${publicId}`);
        }
        const result = await cloudinary.uploader.upload(req.files[field][0].path, {
          folder: "about_images",
        });
        return result.secure_url;
      }
      return existingUrl;
    };

    const imagenLight = await uploadAndReplace("imagen_light", existing.imagen_light);
    const imagenDark = await uploadAndReplace("imagen_dark", existing.imagen_dark);

    const updated = await updateAboutDB(
      titulo,
      descripcion,
      imagenLight,
      imagenDark,
      existing.id
    );

    res.json({ message: "About actualizado ✅", about: updated });
  } catch (err) {
    console.error("Error updateAbout:", err);
    res.status(500).json({ error: "Error al actualizar about" });
  }
};
