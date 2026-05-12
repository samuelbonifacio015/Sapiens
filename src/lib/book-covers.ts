import type { Libro } from '../types/index.js';

const bookCoverBySlug: Record<string, string> = {
  'la-ciudad-y-los-perros': '/books/laciudad-y-los-perros.jpg',
  'laciudad-y-los-perros': '/books/laciudad-y-los-perros.jpg',
  'la-tentacion-del-fracaso': '/books/tentacion-fracaso.jpg',
  'cien-anos-de-soledad': '/books/cien-anios-soledad.jpg',
  'la-casa-de-los-espiritus': '/books/casa-espiritus.jpg',
  'sapiens-de-animales-a-dioses': '/books/sapiens.jpg',
  'meridiano-de-sangre': '/books/meridiano-sangre.jpg',
  'contarlo-todo': '/books/contarlo-todo.jpg',
  'bioy': '/books/bioy.jpg',
  'al-final-de-la-calle': '/books/al-final-de-la-calle.jpg',
  'las-tres-mitades-de-ino-moxo': '/books/tres-mitades-imo-moxo.jpg',
  'malambo': '/books/360055_portada_malambo_lucia-charun-illescas_202205210056.jpg',
  'matalache': '/books/matalache.jpg',
  'cholito-en-los-andes-magicos': '/books/cholito.jpg',
  'paco-yunque': '/books/paco-yunque.jpg',
  'trilce': '/books/trilce.jpg',
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
