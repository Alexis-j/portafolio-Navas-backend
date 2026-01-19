import db from '../config/db.js';

export const getAllPaquetes = async () => {
  const result = await db.query('SELECT * FROM paquetes ORDER BY id');
  return result.rows;
};

export const createPaquete = async (nombre, descripcion, precio) => {
  const result = await db.query(
    'INSERT INTO paquetes (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *',
    [nombre, descripcion, precio]
  );
  return result.rows[0];
};
