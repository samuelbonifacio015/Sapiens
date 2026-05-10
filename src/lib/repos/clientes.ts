import { db } from '../db.js';
import { mapCliente } from '../mappers.js';
import type { Cliente, Rol } from '../../types/index.js';

export interface ClienteAuthRow {
  id_cliente: number;
  password_hash: string | null;
  rol: Rol;
}

export async function findClienteByCorreo(correo: string): Promise<ClienteAuthRow | null> {
  const [rows]: any = await db.query(
    `SELECT ID_Cliente, Password_Hash, Rol FROM Clientes WHERE Correo = :correo LIMIT 1`,
    { correo }
  );
  const r = rows[0];
  if (!r) return null;
  return { id_cliente: r.ID_Cliente, password_hash: r.Password_Hash, rol: r.Rol };
}

export async function findClienteById(id: number): Promise<Cliente | null> {
  const [rows]: any = await db.query(`SELECT * FROM Clientes WHERE ID_Cliente = :id`, { id });
  return rows[0] ? mapCliente(rows[0]) : null;
}

export async function createCliente(data: {
  nombre_cliente: string;
  correo: string;
  password_hash: string;
  rol?: Rol;
  telefono?: string | null;
  direccion?: string | null;
}): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO Clientes (Nombre_Cliente, Correo, Password_Hash, Rol, Telefono, Direccion)
     VALUES (:nombre, :correo, :hash, :rol, :tel, :dir)`,
    {
      nombre: data.nombre_cliente,
      correo: data.correo,
      hash: data.password_hash,
      rol: data.rol ?? 'USER',
      tel: data.telefono ?? null,
      dir: data.direccion ?? null,
    }
  );
  return res.insertId as number;
}

export async function updateCliente(id: number, data: { nombre_cliente?: string; telefono?: string | null; direccion?: string | null }): Promise<boolean> {
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  if (data.nombre_cliente !== undefined) { sets.push('Nombre_Cliente = :nombre'); params.nombre = data.nombre_cliente; }
  if (data.telefono !== undefined)       { sets.push('Telefono = :tel');           params.tel = data.telefono ?? null; }
  if (data.direccion !== undefined)      { sets.push('Direccion = :dir');          params.dir = data.direccion ?? null; }
  if (!sets.length) return false;
  const [res]: any = await db.query(`UPDATE Clientes SET ${sets.join(', ')} WHERE ID_Cliente = :id`, params as any);
  return res.affectedRows > 0;
}

export async function findAllClientes(): Promise<Cliente[]> {
  const [rows]: any = await db.query(`SELECT * FROM Clientes ORDER BY ID_Cliente DESC`);
  return rows.map(mapCliente);
}
