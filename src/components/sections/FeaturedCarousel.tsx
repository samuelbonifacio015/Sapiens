import { useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import type { Libro, Revista } from '../../types/index.js';
import { getBookCoverSrc } from '../../lib/book-covers.js';
import { getMagazineCoverSrc } from '../../lib/magazine-covers.js';

interface CarouselItem {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
}

interface Props {
  items: CarouselItem[];
  title: string;
  subtitle?: string;
  viewAllHref: string;
  viewAllLabel: string;
}

function ProductCardMini({ producto, tipo }: CarouselItem) {
  const isLibro = tipo === 'libro';
  const libro = isLibro ? (producto as Libro) : null;
  const revista = !isLibro ? (producto as Revista) : null;
  const href = isLibro ? `/libros/${libro!.id_libro}` : `/revistas/${revista!.id_revista}`;
  const autorName = libro?.autor?.nombre_autor ?? '';
  const frecuencia = revista?.frecuencia ?? '';
  const coverSrc = libro ? getBookCoverSrc(libro) : revista ? getMagazineCoverSrc(revista) : '';
  const aspectRatio = isLibro ? 'aspect-[2/3]' : 'aspect-[3/4]';

  return (
    <article className="group flex flex-col bg-surface border border-border rounded overflow-hidden hover:border-primary transition-colors duration-150 w-44 sm:w-52 flex-shrink-0">
      <a href={href} className="block relative overflow-hidden" aria-label={`Ver detalle de ${producto.titulo}`}>
        <div className={`${aspectRatio} w-full relative overflow-hidden bg-[#F4F1EA]`}>
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={`Portada de ${producto.titulo}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-[#F4F1EA]" />
          )}
        </div>
      </a>
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <a href={href}>
          <h3 className="font-playfair font-medium text-text text-sm leading-tight line-clamp-2 hover:underline">
            {producto.titulo}
          </h3>
        </a>
        {autorName && <p className="text-text-muted text-xs font-inter">{autorName}</p>}
        {frecuencia && <p className="text-text-muted text-[10px] font-inter uppercase tracking-wide">{frecuencia}</p>}
        <span className="font-inter font-bold text-text text-sm mt-auto">S/ {producto.precio.toFixed(2)}</span>
      </div>
    </article>
  );
}

function InfiniteTrack({ items }: { items: CarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const halfWidthRef = useRef(0);
  const SPEED = 40; // px/s

  useAnimationFrame((_, delta) => {
    if (paused || !trackRef.current) return;
    if (!halfWidthRef.current) {
      const w = trackRef.current.scrollWidth / 2;
      if (w === 0) return;
      halfWidthRef.current = w;
    }
    const halfWidth = halfWidthRef.current;
    const next = x.get() - (SPEED * delta) / 1000;
    // wrap using addition to preserve sub-pixel offset — no jump
    x.set(next <= -halfWidth ? next + halfWidth : next);
  });

  const track = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div ref={trackRef} className="flex gap-4 px-6 w-max" style={{ x }}>
        {track.map((item, i) => (
          <ProductCardMini key={i} {...item} />
        ))}
      </motion.div>
    </div>
  );
}

export default function FeaturedCarousel({ items, title, subtitle, viewAllHref, viewAllLabel }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-6 mb-6 lg:mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-playfair font-bold text-3xl text-text">{title}</h2>
          {subtitle && <p className="font-inter text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
        <a
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 font-inter text-sm font-medium text-text-muted hover:text-text transition-colors underline flex-shrink-0"
        >
          {viewAllLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      {prefersReduced ? (
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {items.map((item, i) => (
              <ProductCardMini key={i} {...item} />
            ))}
          </div>
        </div>
      ) : (
        <InfiniteTrack items={items} />
      )}
    </div>
  );
}
