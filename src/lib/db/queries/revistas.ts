import { db } from '../index';
import { revistas, categorias } from '../schema';
import { eq, lte } from 'drizzle-orm';
import type { Revista, Categoria } from '../../types/index.js';

function mapCategoria(r: typeof categorias.$inferSelect): Categoria {
  return { id_categoria: r.ID_Categoria, nombre_categoria: r.Nombre_Categoria };
}

function mapRevista(
  r: typeof revistas.$inferSelect,
  categoria: Categoria | null,
): Revista {
  return {
    id_revista:   r.ID_Revista,
    issn:         r.ISSN,
    titulo:       r.Titulo,
    editorial:    r.Editorial ?? '',
    frecuencia:   (r.Frecuencia as Revista['frecuencia']) ?? 'Mensual',
    precio:       Number(r.Precio),
    stock:        r.Stock ?? 0,
    id_categoria: r.ID_Categoria ?? 0,
    categoria:    categoria ?? undefined,
  };
}

async function enrich(rows: (typeof revistas.$inferSelect)[]): Promise<Revista[]> {
  const allCategorias = await db.select().from(categorias);
  return rows.map(r => mapRevista(
    r,
    allCategorias.find(c => c.ID_Categoria === r.ID_Categoria) ? mapCategoria(allCategorias.find(c => c.ID_Categoria === r.ID_Categoria)!) : null,
  ));
}

export async function getRevistas(): Promise<Revista[]> {
  return enrich(await db.select().from(revistas));
}

export async function getRevistaById(id: number): Promise<Revista | null> {
  const rows = await db.select().from(revistas).where(eq(revistas.ID_Revista, id));
  if (!rows[0]) return null;
  return (await enrich([rows[0]]))[0];
}

export async function getRevistasByCategoria(idCategoria: number): Promise<Revista[]> {
  return enrich(await db.select().from(revistas).where(eq(revistas.ID_Categoria, idCategoria)));
}

export async function getLowStockRevistas(threshold = 5): Promise<Revista[]> {
  return enrich(await db.select().from(revistas).where(lte(revistas.Stock, threshold)));
}
