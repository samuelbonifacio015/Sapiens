import mysql from 'mysql2/promise';

const env = (k: string, fallback?: string): string => {
  const v = (import.meta.env as Record<string, string | undefined>)[k] ?? process.env[k];
  if (v == null) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing env var ${k}`);
  }
  return v;
};

export const db = mysql.createPool({
  host: env('DB_HOST', '127.0.0.1'),
  port: Number(env('DB_PORT', '3306')),
  user: env('DB_USER'),
  password: env('DB_PASS', ''),
  database: env('DB_NAME', 'Sapiens_DB'),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  decimalNumbers: true,
});
