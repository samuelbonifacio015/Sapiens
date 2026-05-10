-- Add auth columns to Clientes
USE Sapiens_DB;

ALTER TABLE Clientes
  ADD COLUMN Password_Hash VARCHAR(255) NULL AFTER Correo,
  ADD COLUMN Rol ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER' AFTER Password_Hash;

-- Admin seeded via scripts/seed-admin.ts (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)
