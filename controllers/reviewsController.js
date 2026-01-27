import { cloudinary } from "../utils/cloudinary.js"; // Configuración Cloudinary
import pool from "../config/db.js";

const uploadFile = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "reviews",
  });
  return result.secure_url;
};

const deleteCloudFile = async (url) => {
  if (!url) return;
  const parts = url.split("/");
  const filename = parts[parts.length - 1].split(".")[0]; // nombre sin extensión
  await cloudinary.uploader.destroy(`reviews/${filename}`);
};

export const getReviews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting reviews:", err);
    res.status(500).json({ error: "Error getting reviews" });
  }
};

export const createReview = async (req, res) => {
  const { client_name, review_text, link } = req.body;
  try {
    const client_photo = await uploadFile(req.file);

    const result = await pool.query(
      `INSERT INTO reviews (client_name, review_text, client_photo, link)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_name, review_text, client_photo, link]
    );

    res.json({
      message: "Review created successfully",
      review: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Error creating review" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRes = await pool.query(
      "SELECT * FROM reviews WHERE id = $1",
      [id]
    );

    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    const existing = existingRes.rows[0];

    const client_name = req.body?.client_name || existing.client_name;
    const review_text = req.body?.review_text || existing.review_text;
    const link = req.body?.link || existing.link;

    let client_photo = existing.client_photo;

    if (req.file) {
      await deleteCloudFile(existing.client_photo);
      client_photo = await uploadFile(req.file);
    }

    const updated = await pool.query(
      `UPDATE reviews
       SET client_name = $1, review_text = $2, link = $3, client_photo = $4
       WHERE id = $5
       RETURNING *`,
      [client_name, review_text, link, client_photo, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("Error updating review:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT client_photo FROM reviews WHERE id = $1",
      [id]
    );

    const photo = result.rows[0]?.client_photo;
    await deleteCloudFile(photo);

    await pool.query("DELETE FROM reviews WHERE id = $1", [id]);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Error deleting review" });
  }
};
