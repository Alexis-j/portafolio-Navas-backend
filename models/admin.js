// models/adminModel.js
import pool from "../config/db.js";

export const findAdminByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM admins WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

export const findAdminByResetToken = async (token) => {
  const result = await pool.query(
    "SELECT * FROM admins WHERE reset_token = $1 AND reset_token_expiration > NOW()",
    [token]
  );
  return result.rows[0];
};

export const createAdminDB = async (nombre, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO admins (nombre, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, email`,
    [nombre, email, hashedPassword]
  );
  return result.rows[0];
};

export const saveResetTokenDB = async (id, token, expiration) => {
  await pool.query(
    `UPDATE admins SET reset_token=$1, reset_token_expiration=$2
     WHERE id=$3`,
    [token, expiration, id]
  );
};

export const updatePasswordDB = async (adminId, hashedPassword) => {
  await pool.query(
    `UPDATE admins
     SET password=$1, reset_token=NULL, reset_token_expiration=NULL
     WHERE id=$2`,
    [hashedPassword, adminId]
  );
};
