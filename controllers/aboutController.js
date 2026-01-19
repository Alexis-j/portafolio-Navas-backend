import {
  createAboutDB,
  getAboutDB,
  updateAboutDB
} from "../models/about.js";

import fs from "fs";
import path from "path";

// GET
export const getAbout = async (req, res) => {
  try {
    const about = await getAboutDB();
    res.json(about);
  } catch (err) {
    console.error("Error en getAbout:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// CREATE
export const createAbout = async (req, res) => {
  const { titulo, descripcion } = req.body;

  const imagenLight = req.files?.imagen_light?.[0]?.filename || null;
  const imagenDark = req.files?.imagen_dark?.[0]?.filename || null;

  try {
    const nuevo = await createAboutDB(titulo, descripcion, imagenLight, imagenDark);
    res.json({ message: "About creado", about: nuevo });
  } catch (err) {
    console.error("Error createAbout:", err);
    res.status(500).json({ error: "Error al crear about" });
  }
};

// UPDATE
export const updateAbout = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    const imagenLight = req.files?.imagen_light?.[0]?.filename || null;
    const imagenDark = req.files?.imagen_dark?.[0]?.filename || null;

    const existing = await getAboutDB();
    if (!existing) return res.status(404).json({ error: "No existe about" });

    const id = existing.id;

    if (imagenLight && existing.imagen_light) {
      fs.unlink(`./uploads/${existing.imagen_light}`, () => {});
    }
    if (imagenDark && existing.imagen_dark) {
      fs.unlink(`./uploads/${existing.imagen_dark}`, () => {});
    }

    const updated = await updateAboutDB(
      titulo,
      descripcion,
      imagenLight,
      imagenDark,
      id
    );

    res.json({ message: "About actualizado", about: updated });
  } catch (err) {
    console.error("Error updateAbout:", err);
    res.status(500).json({ error: "Error al actualizar about" });
  }
};
