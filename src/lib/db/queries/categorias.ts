import { db } from '../index';
import { categorias } from '../schema';
import { eq } from 'drizzle-orm';
import type { Categoria } from '../../types/index.js';

function mapCategoria(r: typeof categorias.$inferSelect): Categoria {
  return {
    id_categoria:     r.ID_Categoria,
    nombre_categoria: r.Nombre_Categoria,
  };
}

export async function getCategorias(): Promise<Categoria[]> {
  const rows = await db.select().from(categorias);
  return rows.map(mapCategoria);
}

export async function getCategoriaById(id: number): Promise<Categoria | null> {
  const rows = await db.select().from(categorias).where(eq(categorias.ID_Categoria, id));
  return rows[0] ? mapCategoria(rows[0]) : null;
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  const rows = await db.select().from(categorias);
  const found = rows.find(r =>
    r.Nombre_Categoria.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );
  return found ? mapCategoria(found) : null;
}
