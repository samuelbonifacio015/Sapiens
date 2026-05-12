import { db } from '../index';
import { autores } from '../schema';
import { eq } from 'drizzle-orm';
import type { Autor } from '../../types/index.js';

function mapAutor(r: typeof autores.$inferSelect): Autor {
  return {
    id_autor:    r.ID_Autor,
    nombre_autor: r.Nombre_Autor,
    bio:         r.Nacionalidad ?? undefined,
  };
}

export async function getAutores(): Promise<Autor[]> {
  const rows = await db.select().from(autores);
  return rows.map(mapAutor);
}

export async function getAutorById(id: number): Promise<Autor | null> {
  const rows = await db.select().from(autores).where(eq(autores.ID_Autor, id));
  return rows[0] ? mapAutor(rows[0]) : null;
}
