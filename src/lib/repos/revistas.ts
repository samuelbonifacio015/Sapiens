import { db } from '../db.js';
import { mapRevista } from '../mappers.js';
import type { Revista } from '../../types/index.js';
import type { RevistaCreateInput, RevistaUpdateInput } from '../validators/revista.js';

const SELECT = `
  SELECT R.*, C.Nombre_Categoria
  FROM Revistas R
  LEFT JOIN Categorias C ON C.ID_Categoria = R.ID_Categoria
`;

export interface RevistaFilter { categoria?: number; q?: string; page?: number; size?: number; }

export async function findAllRevistas(filter: RevistaFilter = {}): Promise<Revista[]> {
  const { categoria, q, page = 1, size = 50 } = filter;
  const where: string[] = [];
  const params: Record<string, unknown> = {
    limit: Math.min(size, 200),
    offset: (Math.max(page, 1) - 1) * size,
  };
  if (categoria) { where.push('R.ID_Categoria = :categoria'); params.categoria = categoria; }
  if (q)         { where.push('R.Titulo LIKE :q');             params.q = `%${q}%`; }
  const sql = `${SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY R.ID_Revista DESC LIMIT :limit OFFSET :offset`;
  const [rows] = await db.query(sql, params as any);
  return (rows as any[]).map(mapRevista);
}

export async function findRevistaById(id: number): Promise<Revista | null> {
  const [rows] = await db.query(`${SELECT} WHERE R.ID_Revista = :id`, { id });
  const r = (rows as any[])[0];
  return r ? mapRevista(r) : null;
}

export async function createRevista(data: RevistaCreateInput): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO Revistas (ISSN, Titulo, Editorial, Frecuencia, Precio, Stock, ID_Categoria)
     VALUES (:issn, :titulo, :editorial, :frecuencia, :precio, :stock, :id_categoria)`,
    {
      issn: data.issn, titulo: data.titulo,
      editorial: data.editorial ?? null,
      frecuencia: data.frecuencia ?? null,
      precio: data.precio, stock: data.stock,
      id_categoria: data.id_categoria,
    }
  );
  return res.insertId as number;
}

export async function updateRevista(id: number, data: RevistaUpdateInput): Promise<boolean> {
  const colMap: Record<keyof RevistaUpdateInput, string> = {
    issn: 'ISSN', titulo: 'Titulo', editorial: 'Editorial', frecuencia: 'Frecuencia',
    precio: 'Precio', stock: 'Stock', id_categoria: 'ID_Categoria',
  };
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    sets.push(`${colMap[k as keyof RevistaUpdateInput]} = :${k}`);
    params[k] = v;
  }
  if (!sets.length) return false;
  const [res]: any = await db.query(`UPDATE Revistas SET ${sets.join(', ')} WHERE ID_Revista = :id`, params as any);
  return res.affectedRows > 0;
}

export async function deleteRevista(id: number): Promise<boolean> {
  const [res]: any = await db.query(`DELETE FROM Revistas WHERE ID_Revista = :id`, { id });
  return res.affectedRows > 0;
}
