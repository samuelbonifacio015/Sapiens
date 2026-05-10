import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const need = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var ${k}`);
  return v;
};

async function main() {
  const email = need('ADMIN_EMAIL');
  const password = need('ADMIN_PASSWORD');

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be >= 12 chars');
  }

  const hash = await bcrypt.hash(password, 12);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: need('DB_USER'),
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'Sapiens_DB',
  });

  try {
    const [rows] = await conn.execute(
      'SELECT ID_Cliente FROM Clientes WHERE Correo = ?',
      [email]
    );

    if ((rows as unknown[]).length > 0) {
      await conn.execute(
        'UPDATE Clientes SET Password_Hash = ?, Rol = ? WHERE Correo = ?',
        [hash, 'ADMIN', email]
      );
      console.log(`Updated admin: ${email}`);
    } else {
      await conn.execute(
        `INSERT INTO Clientes (Nombre_Cliente, Correo, Password_Hash, Rol, Telefono, Direccion)
         VALUES (?, ?, ?, 'ADMIN', NULL, NULL)`,
        ['Admin', email, hash]
      );
      console.log(`Created admin: ${email}`);
    }
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
