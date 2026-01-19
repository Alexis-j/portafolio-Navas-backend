import pool from "../config/db.js";

// Get all hero sections
export const getAllHeroDB = async () => {
  const result = await pool.query("SELECT * FROM hero_section");
  return result.rows;
};

// Get hero section by id
export const getHeroByIdDB = async (id) => {
  const result = await pool.query(
    "SELECT * FROM hero_section WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// Create new hero section
export const createHeroDB = async (
  title,
  subtitle,
  image_light,
  image_dark,
  image_mobile_light,
  image_mobile_dark,
  logo_light,
  logo_dark,
  show_text
) => {
  const result = await pool.query(
    `INSERT INTO hero_section
      (
        title,
        subtitle,
        image_light,
        image_dark,
        image_mobile_light,
        image_mobile_dark,
        logo_light,
        logo_dark,
        show_text
      )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      title,
      subtitle,
      image_light,
      image_dark,
      image_mobile_light,
      image_mobile_dark,
      logo_light,
      logo_dark,
      show_text,
    ]
  );

  return result.rows[0];
};


// Update hero section
export const updateHeroDB = async (
  id,
  title,
  subtitle,
  image_light,
  image_dark,
  image_mobile_light,
  image_mobile_dark,
  logo_light,
  logo_dark,
  show_text
) => {
  const result = await pool.query(
    `UPDATE hero_section
     SET
       title = $1,
       subtitle = $2,
       image_light = $3,
       image_dark = $4,
       image_mobile_light = $5,
       image_mobile_dark = $6,
       logo_light = $7,
       logo_dark = $8,
       show_text = $9
     WHERE id = $10
     RETURNING *`,
    [
      title,
      subtitle,
      image_light,
      image_dark,
      image_mobile_light,
      image_mobile_dark,
      logo_light,
      logo_dark,
      show_text,
      id,
    ]
  );

  return result.rows[0];
};


// Delete hero section
export const deleteHeroDB = async (id) => {
  await pool.query("DELETE FROM hero_section WHERE id=$1", [id]);
};

// Toggle show_text
export const toggleHeroTextDB = async (id) => {
  const result = await pool.query(
    `UPDATE hero_section
     SET show_text = NOT show_text
     WHERE id=$1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};
