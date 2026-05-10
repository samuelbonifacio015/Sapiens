import { db } from '../db.js';
import { mapCategoria } from '../mappers.js';
import type { Categoria } from '../../types/index.js';
import type { CategoriaCreateInput, CategoriaUpdateInput } from '../validators/categoria.js';

export async function findAllCategorias(): Promise<Categoria[]> {
  const [rows] = await db.query(`SELECT * FROM Categorias ORDER BY Nombre_Categoria`);
  return (rows as any[]).map(mapCategoria);
}

export async function findCategoriaById(id: number): Promise<Categoria | null> {
  const [rows] = await db.query(`SELECT * FROM Categorias WHERE ID_Categoria = :id`, { id });
  const r = (rows as any[])[0];
  return r ? mapCategoria(r) : null;
}

export async function createCategoria(data: CategoriaCreateInput): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO Categorias (Nombre_Categoria, Descripcion) VALUES (:nombre, :desc)`,
    { nombre: data.nombre_categoria, desc: data.descripcion ?? null }
  );
  return res.insertId as number;
}

export async function updateCategoria(id: number, data: CategoriaUpdateInput): Promise<boolean> {
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  if (data.nombre_categoria !== undefined) { sets.push('Nombre_Categoria = :nombre'); params.nombre = data.nombre_categoria; }
  if (data.descripcion !== undefined)      { sets.push('Descripcion = :desc');         params.desc = data.descripcion ?? null; }
  if (!sets.length) return false;
  const [res]: any = await db.query(`UPDATE Categorias SET ${sets.join(', ')} WHERE ID_Categoria = :id`, params as any);
  return res.affectedRows > 0;
}

export async function deleteCategoria(id: number): Promise<boolean> {
  const [res]: any = await db.query(`DELETE FROM Categorias WHERE ID_Categoria = :id`, { id });
  return res.affectedRows > 0;
}
