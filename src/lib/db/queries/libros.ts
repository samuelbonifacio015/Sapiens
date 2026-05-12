import { db } from '../index';
import { libros, autores, categorias } from '../schema';
import { eq, lte } from 'drizzle-orm';
import type { Libro, Autor, Categoria } from '../../types/index.js';

function mapCategoria(r: typeof categorias.$inferSelect): Categoria {
  return { id_categoria: r.ID_Categoria, nombre_categoria: r.Nombre_Categoria };
}

function mapAutor(r: typeof autores.$inferSelect): Autor {
  return { id_autor: r.ID_Autor, nombre_autor: r.Nombre_Autor, bio: r.Nacionalidad ?? undefined };
}

function mapLibro(
  r: typeof libros.$inferSelect,
  autor: Autor | null,
  categoria: Categoria | null,
): Libro {
  return {
    id_libro:         r.ID_Libro,
    isbn:             r.ISBN,
    titulo:           r.Titulo,
    editorial:        r.Editorial ?? '',
    anio_publicacion: r.Anio_Publicacion ?? 0,
    precio:           Number(r.Precio),
    stock:            r.Stock ?? 0,
    id_categoria:     r.ID_Categoria ?? 0,
    id_autor:         r.ID_Autor ?? 0,
    autor:            autor ?? undefined,
    categoria:        categoria ?? undefined,
  };
}

async function enrich(rows: (typeof libros.$inferSelect)[]): Promise<Libro[]> {
  const [allAutores, allCategorias] = await Promise.all([
    db.select().from(autores),
    db.select().from(categorias),
  ]);
  return rows.map(r => mapLibro(
    r,
    allAutores.find(a => a.ID_Autor === r.ID_Autor) ? mapAutor(allAutores.find(a => a.ID_Autor === r.ID_Autor)!) : null,
    allCategorias.find(c => c.ID_Categoria === r.ID_Categoria) ? mapCategoria(allCategorias.find(c => c.ID_Categoria === r.ID_Categoria)!) : null,
  ));
}

export async function getLibros(): Promise<Libro[]> {
  return enrich(await db.select().from(libros));
}

export async function getLibroById(id: number): Promise<Libro | null> {
  const rows = await db.select().from(libros).where(eq(libros.ID_Libro, id));
  if (!rows[0]) return null;
  return (await enrich([rows[0]]))[0];
}

export async function getLibrosByCategoria(idCategoria: number): Promise<Libro[]> {
  return enrich(await db.select().from(libros).where(eq(libros.ID_Categoria, idCategoria)));
}

export async function getLibrosByAutor(idAutor: number): Promise<Libro[]> {
  return enrich(await db.select().from(libros).where(eq(libros.ID_Autor, idAutor)));
}

export async function getLowStockLibros(threshold = 5): Promise<Libro[]> {
  return enrich(await db.select().from(libros).where(lte(libros.Stock, threshold)));
}
