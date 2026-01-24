import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL, // Railway ya te da esto
  ssl: { rejectUnauthorized: false }, // necesario para Railway
});

export default pool;

