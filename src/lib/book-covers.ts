import type { Libro } from '../types/index.js';

const bookCoverBySlug: Record<string, string> = {
  'la-ciudad-y-los-perros': '/books/laciudad-y-los-perros.jpg',
  'laciudad-y-los-perros': '/books/laciudad-y-los-perros.jpg',
  'la-tentacion-del-fracaso': '/books/tentacion-fracaso.jpg',
  'cien-anos-de-soledad': '/books/cien-anios-soledad.jpg',
  'la-casa-de-los-espiritus': '/books/casa-espiritus.jpg',
  'sapiens-de-animales-a-dioses': '/books/sapiens.jpg',
  'meridiano-de-sangre': '/books/meridiano-sangre.jpg',
};

function slugifyTitle(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBookCoverSrc(libro: Pick<Libro, 'titulo'>) {
  return bookCoverBySlug[slugifyTitle(libro.titulo)] ?? '';
}
