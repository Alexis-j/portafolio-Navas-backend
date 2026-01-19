import pool from "../config/db.js";

export const GalleryModel = {

  /* ===== PÚBLICO ===== */
    getCategories: async () => {
  const { rows } = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.slug,
      c.cover_photo_id,
      p.image_url AS cover_image
    FROM gallery_categories c
    LEFT JOIN gallery_photos p
      ON p.id = c.cover_photo_id
    ORDER BY c.id
  `);

  return rows;
},

  getPhotosByCategorySlug: async (slug) => {
    const { rows } = await pool.query(`
      SELECT p.id, p.image_url
      FROM gallery_photos p
      JOIN gallery_category_photos gcp ON p.id = gcp.photo_id
      JOIN gallery_categories c ON c.id = gcp.category_id
      WHERE c.slug = $1 AND p.is_active = true
      ORDER BY gcp.display_order
    `, [slug]);
    return rows;
  },


  /* ===== ADMIN ===== */

  getCategoryWithPhotos: async (categoryId) => {
    const category = await pool.query(
      `SELECT id, name, cover_photo_id FROM gallery_categories WHERE id = $1`,
      [categoryId]
    );


    const photos = await pool.query(`
      SELECT p.id, p.image_url,
             (p.id = $2) AS is_cover
      FROM gallery_photos p
      JOIN gallery_category_photos gcp ON p.id = gcp.photo_id
      WHERE gcp.category_id = $1
      ORDER BY gcp.display_order
    `, [categoryId, category.rows[0]?.cover_photo_id]);

    return {
      category: category.rows[0],
      photos: photos.rows
    };
  },

  setCategoryCover: async (categoryId, photoId) => {
    const { rows } = await pool.query(`
      UPDATE gallery_categories
      SET cover_photo_id = $1
      WHERE id = $2
      RETURNING *
    `, [photoId, categoryId]);

    return rows[0];
  },

  createPhoto: async (imageUrl) => {
    const { rows } = await pool.query(
      `INSERT INTO gallery_photos (image_url)
       VALUES ($1)
       RETURNING *`,
      [imageUrl]
    );
    return rows[0];
  },

  assignPhotoToCategory: async (photoId, categoryId) => {
    const { rows } = await pool.query(`
      INSERT INTO gallery_category_photos (photo_id, category_id, display_order)
      VALUES ($1, $2, 0)
      ON CONFLICT DO NOTHING
      RETURNING *
    `, [photoId, categoryId]);

    return rows[0];
  },

  getPhotoById: async (id) => {
    const { rows } = await pool.query(
      `SELECT * FROM gallery_photos WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  deletePhoto: async (id) => {
    await pool.query(`DELETE FROM gallery_category_photos WHERE photo_id = $1`, [id]);
    await pool.query(`DELETE FROM gallery_photos WHERE id = $1`, [id]);
  },
  removePhotoFromCategory: async (photoId, categoryId) => {
  const result = await pool.query(
    `DELETE FROM gallery_category_photos
     WHERE photo_id = $1 AND category_id = $2
     RETURNING *`,
    [photoId, categoryId]
  );
  return result.rows[0];
},


  getAllPhotosForDashboard: async () => {
    const { rows } = await pool.query(`
      SELECT p.id, p.image_url, p.is_active,
             json_agg(json_build_object('id', c.id, 'name', c.name))
             FILTER (WHERE c.id IS NOT NULL) AS categories
      FROM gallery_photos p
      LEFT JOIN gallery_category_photos gcp ON p.id = gcp.photo_id
      LEFT JOIN gallery_categories c ON c.id = gcp.category_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
    return rows;
  },

  togglePhotoActive: async (id) => {
    const { rows } = await pool.query(`
      UPDATE gallery_photos
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `, [id]);
    return rows[0];
  },
  // ADMIN – editor de categoría
getCategoryEditorData: async (categoryId) => {
  const categoryRes = await pool.query(
    `SELECT id, name, cover_photo_id
     FROM gallery_categories
     WHERE id = $1`,
    [categoryId]
  );

  const photosRes = await pool.query(
    `SELECT p.id, p.image_url, p.is_active, gcp.display_order
     FROM gallery_photos p
     JOIN gallery_category_photos gcp
       ON p.id = gcp.photo_id
     WHERE gcp.category_id = $1
     ORDER BY gcp.display_order`,
    [categoryId]
  );

  return {
    category: categoryRes.rows[0],
    photos: photosRes.rows
  };
},
    updatePhotoOrder: async (categoryId, photoId, display_order) => {
    return pool.query(
      `
      UPDATE gallery_category_photos
      SET display_order = $1
      WHERE category_id = $2 AND photo_id = $3
      `,
      [display_order, categoryId, photoId]
    );
  }
};
