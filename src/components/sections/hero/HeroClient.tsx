import { motion } from 'framer-motion';
import BookCovers from './BookCovers';
import MagneticCTA from './MagneticCTA';

const headingLines = [
  { text: 'Los libros',        limeUnderline: false },
  { text: 'que Lima',          limeUnderline: true  },
  { text: 'estaba esperando.', limeUnderline: false },
];

export default function HeroClient() {
  return (
    <div className="max-w-[1280px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center py-24 lg:py-32">
        {/* Left: text column */}
        <div className="flex flex-col gap-6">
          <h1 className="font-playfair font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-[#0D0D0D] leading-[1.05] tracking-tight">
            {headingLines.map(({ text, limeUnderline }, i) => (
              <motion.span
                key={i}
                className="relative block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              >
                {text}
                {limeUnderline && (
                  <motion.span
                    className="absolute left-0 h-[3px] bg-[#D4FF00] rounded-full"
                    style={{ bottom: '-4px' }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                    aria-hidden="true"
                  />
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="font-inter text-[#5C5C5C] text-lg leading-relaxed max-w-[42ch]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          >
            Más de 2,000 títulos. Envíos a Lima y provincias.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.70 }}
          >
            <MagneticCTA href="/catalogo" variant="primary">
              Explorar catálogo
            </MagneticCTA>
            <MagneticCTA href="/catalogo/libros" variant="ghost">
              Ver novedades
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </MagneticCTA>
          </motion.div>

          <motion.p
            className="font-inter text-xs text-[#5C5C5C] tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.90 }}
          >
            Libros · Revistas · Digital · Físico
          </motion.p>
        </div>

        {/* Right: book covers — desktop only */}
        <div className="hidden lg:flex justify-end">
          <BookCovers />
        </div>
      </div>
    </div>
  );
}
