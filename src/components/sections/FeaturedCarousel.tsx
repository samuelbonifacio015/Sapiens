import { useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import type { Libro, Revista } from '../../types/index.js';

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

const placeholderColors = ['#E8E0D5', '#D5DDE8', '#D5E8D5', '#E8D5E0', '#E8E8D5'];

function ProductCardMini({ producto, tipo }: CarouselItem) {
  const isLibro = tipo === 'libro';
  const libro = isLibro ? (producto as Libro) : null;
  const revista = !isLibro ? (producto as Revista) : null;
  const href = isLibro ? `/libros/${libro!.id_libro}` : `/revistas/${revista!.id_revista}`;
  const colorIndex = ((producto as Libro).id_libro ?? (producto as Revista).id_revista ?? 0) % placeholderColors.length;
  const placeholderBg = placeholderColors[colorIndex];
  const autorName = libro?.autor?.nombre_autor ?? '';
  const frecuencia = revista?.frecuencia ?? '';

  return (
    <article className="group flex flex-col bg-surface border border-border rounded overflow-hidden hover:border-primary transition-colors duration-150 w-44 sm:w-52 flex-shrink-0">
      <a href={href} className="block relative overflow-hidden" aria-label={`Ver detalle de ${producto.titulo}`}>
        <div
          className="aspect-[2/3] w-full relative overflow-hidden"
          style={{ backgroundColor: placeholderBg }}
        >
          <div className="absolute inset-0 flex items-end p-3">
            <span className="text-[10px] font-inter font-medium text-[#5C5C5C] uppercase tracking-widest line-clamp-2">
              {producto.titulo}
            </span>
          </div>
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

export default function FeaturedCarousel({ items, title, subtitle, viewAllHref, viewAllLabel }: Props) {
  const controls = useAnimationControls();
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = [...items, ...items];
  const duration = items.length * 8;

  const startAnimation = () => {
    if (prefersReduced) return;
    controls.start({
      x: ['-0%', '-50%'],
      transition: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
    });
  };

  const pauseAnimation = () => controls.stop();

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
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
          onMouseEnter={pauseAnimation}
          onMouseLeave={startAnimation}
        >
          <motion.div
            className="flex gap-4 px-6"
            animate={controls}
            onViewportEnter={startAnimation}
          >
            {track.map((item, i) => (
              <ProductCardMini key={i} {...item} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
