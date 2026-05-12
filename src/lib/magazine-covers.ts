import type { Revista } from '../types/index.js';

const magazineCoverBySlug: Record<string, string> = {
  'national-geographic-en-espanol': '/magazines/national-geographic.jpg',
  'caretas': '/magazines/caretas.jpg',
  'billiken': '/magazines/biliken.jpg',
};

function slugifyTitle(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getMagazineCoverSrc(revista: Pick<Revista, 'titulo'>) {
  return magazineCoverBySlug[slugifyTitle(revista.titulo)] ?? '';
}
