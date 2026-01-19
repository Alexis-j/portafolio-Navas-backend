// models/aboutModel.js
import pool from "../config/db.js";

export const getAboutDB = async () => {
  const result = await pool.query("SELECT * FROM about_me LIMIT 1");
  return result.rows[0];
};

export const createAboutDB = async (titulo, descripcion, imagenLight, imagenDark) => {
  const result = await pool.query(
    `INSERT INTO about_me (titulo, descripcion, imagen_light, imagen_dark)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [titulo, descripcion, imagenLight, imagenDark]
  );
  return result.rows[0];
};

export const updateAboutDB = async (titulo, descripcion, imagenLight, imagenDark, id) => {
  const result = await pool.query(
    `UPDATE about_me
     SET titulo=$1, descripcion=$2,
         imagen_light = COALESCE($3, imagen_light),
         imagen_dark = COALESCE($4, imagen_dark)
     WHERE id=$5
     RETURNING *`,
    [titulo, descripcion, imagenLight, imagenDark, id]
  );
  return result.rows[0];
};
