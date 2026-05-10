import { db } from '../db.js';
import { mapAutor } from '../mappers.js';
import type { Autor } from '../../types/index.js';
import type { AutorCreateInput, AutorUpdateInput } from '../validators/autor.js';

export async function findAllAutores(): Promise<Autor[]> {
  const [rows] = await db.query(`SELECT * FROM Autores ORDER BY Nombre_Autor`);
  return (rows as any[]).map(mapAutor);
}

export async function findAutorById(id: number): Promise<Autor | null> {
  const [rows] = await db.query(`SELECT * FROM Autores WHERE ID_Autor = :id`, { id });
  const r = (rows as any[])[0];
  return r ? mapAutor(r) : null;
}

export async function createAutor(data: AutorCreateInput): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO Autores (Nombre_Autor, Nacionalidad) VALUES (:nombre, :nac)`,
    { nombre: data.nombre_autor, nac: data.nacionalidad ?? null }
  );
  return res.insertId as number;
}

export async function updateAutor(id: number, data: AutorUpdateInput): Promise<boolean> {
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  if (data.nombre_autor !== undefined)  { sets.push('Nombre_Autor = :nombre'); params.nombre = data.nombre_autor; }
  if (data.nacionalidad !== undefined)  { sets.push('Nacionalidad = :nac');     params.nac = data.nacionalidad ?? null; }
  if (!sets.length) return false;
  const [res]: any = await db.query(`UPDATE Autores SET ${sets.join(', ')} WHERE ID_Autor = :id`, params as any);
  return res.affectedRows > 0;
}

export async function deleteAutor(id: number): Promise<boolean> {
  const [res]: any = await db.query(`DELETE FROM Autores WHERE ID_Autor = :id`, { id });
  return res.affectedRows > 0;
}
