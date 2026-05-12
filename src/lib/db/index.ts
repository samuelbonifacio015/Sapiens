import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     import.meta.env.DB_HOST,
  port:     Number(import.meta.env.DB_PORT ?? 3306),
  user:     import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
});

export const db = drizzle(pool);
