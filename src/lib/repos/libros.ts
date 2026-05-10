import { db } from '../db.js';
import { mapLibro } from '../mappers.js';
import type { Libro } from '../../types/index.js';
import type { LibroCreateInput, LibroUpdateInput } from '../validators/libro.js';

const SELECT = `
  SELECT L.*,
         A.Nombre_Autor, A.Nacionalidad,
         C.Nombre_Categoria, C.Descripcion AS Cat_Descripcion
  FROM Libros L
  LEFT JOIN Autores    A ON A.ID_Autor = L.ID_Autor
  LEFT JOIN Categorias C ON C.ID_Categoria = L.ID_Categoria
`;

export interface LibroFilter {
  categoria?: number;
  autor?: number;
  q?: string;
  page?: number;
  size?: number;
}

export async function findAllLibros(filter: LibroFilter = {}): Promise<Libro[]> {
  const { categoria, autor, q, page = 1, size = 50 } = filter;
  const where: string[] = [];
  const params: Record<string, unknown> = {
    limit: Math.min(size, 200),
    offset: (Math.max(page, 1) - 1) * size,
  };
  if (categoria) { where.push('L.ID_Categoria = :categoria'); params.categoria = categoria; }
  if (autor)     { where.push('L.ID_Autor = :autor');         params.autor = autor; }
  if (q)         { where.push('L.Titulo LIKE :q');             params.q = `%${q}%`; }

  const sql = `${SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY L.ID_Libro DESC LIMIT :limit OFFSET :offset`;
  const [rows] = await db.query(sql, params as any);
  return (rows as any[]).map(mapLibro);
}

export async function findLibroById(id: number): Promise<Libro | null> {
  const [rows] = await db.query(`${SELECT} WHERE L.ID_Libro = :id`, { id });
  const r = (rows as any[])[0];
  return r ? mapLibro(r) : null;
}

export async function createLibro(data: LibroCreateInput): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO Libros (ISBN, Titulo, Editorial, Anio_Publicacion, Precio, Stock, ID_Categoria, ID_Autor)
     VALUES (:isbn, :titulo, :editorial, :anio, :precio, :stock, :id_categoria, :id_autor)`,
    {
      isbn: data.isbn,
      titulo: data.titulo,
      editorial: data.editorial ?? null,
      anio: data.anio_publicacion ?? null,
      precio: data.precio,
      stock: data.stock,
      id_categoria: data.id_categoria,
      id_autor: data.id_autor,
    }
  );
  return res.insertId as number;
}

export async function updateLibro(id: number, data: LibroUpdateInput): Promise<boolean> {
  const colMap: Record<keyof LibroUpdateInput, string> = {
    isbn: 'ISBN',
    titulo: 'Titulo',
    editorial: 'Editorial',
    anio_publicacion: 'Anio_Publicacion',
    precio: 'Precio',
    stock: 'Stock',
    id_categoria: 'ID_Categoria',
    id_autor: 'ID_Autor',
  };
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    const col = colMap[k as keyof LibroUpdateInput];
    sets.push(`${col} = :${k}`);
    params[k] = v;
  }
  if (!sets.length) return false;
  const [res]: any = await db.query(`UPDATE Libros SET ${sets.join(', ')} WHERE ID_Libro = :id`, params as any);
  return res.affectedRows > 0;
}

export async function deleteLibro(id: number): Promise<boolean> {
  const [res]: any = await db.query(`DELETE FROM Libros WHERE ID_Libro = :id`, { id });
  return res.affectedRows > 0;
}

export async function countLibros(filter: Pick<LibroFilter, 'categoria' | 'autor' | 'q'> = {}): Promise<number> {
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  if (filter.categoria) { where.push('ID_Categoria = :categoria'); params.categoria = filter.categoria; }
  if (filter.autor)     { where.push('ID_Autor = :autor');         params.autor = filter.autor; }
  if (filter.q)         { where.push('Titulo LIKE :q');             params.q = `%${filter.q}%`; }
  const [rows]: any = await db.query(
    `SELECT COUNT(*) AS n FROM Libros ${where.length ? 'WHERE ' + where.join(' AND ') : ''}`,
    params as any
  );
  return Number(rows[0].n);
}
