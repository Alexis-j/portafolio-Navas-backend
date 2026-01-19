import pool from '../../config/db.js';

export const toggleHeroTexto = async (id) => {
  const result = await pool.query('SELECT mostrar_texto FROM hero WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw new Error('Hero no encontrado');
  }

  const nuevoValor = !result.rows[0].mostrar_texto;

  const updated = await pool.query(
    `UPDATE hero SET mostrar_texto = $1 WHERE id = $2 RETURNING *`,
    [nuevoValor, id]
  );

  return updated.rows[0];
};
