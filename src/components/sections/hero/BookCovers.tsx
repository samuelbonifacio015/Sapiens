import { motion } from 'framer-motion';

const covers = [
  { seed: 'ciudad-perros-mvll',    rotate: -2, entryDelay: 0.40, floatDuration: 3.6, floatDelay: 0.0, col: 0, size: 'lg' as const },
  { seed: 'conversacion-catedral', rotate:  3, entryDelay: 0.50, floatDuration: 4.1, floatDelay: 0.8, col: 1, size: 'md' as const },
  { seed: 'casa-verde-vargas',     rotate:  1, entryDelay: 0.45, floatDuration: 3.9, floatDelay: 0.4, col: 0, size: 'md' as const },
  { seed: 'cien-anos-soledad',     rotate: -1, entryDelay: 0.55, floatDuration: 4.4, floatDelay: 1.2, col: 1, size: 'lg' as const },
  { seed: 'ficciones-borges-arg',  rotate:  2, entryDelay: 0.60, floatDuration: 3.3, floatDelay: 0.2, col: 1, size: 'sm' as const },
];

const sizeClasses: Record<'lg' | 'md' | 'sm', string> = {
  lg: 'w-32 h-44 sm:w-36 sm:h-52',
  md: 'w-28 h-40 sm:w-32 sm:h-44',
  sm: 'w-24 h-32 sm:w-28 sm:h-36',
};

// Derived at module scope — covers is static, no need to filter on each render
const col0 = covers.filter((c) => c.col === 0);
const col1 = covers.filter((c) => c.col === 1);

function Cover({ cover }: { cover: typeof covers[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: cover.entryDelay }}
    >
      {/* rotate is intercepted by Framer Motion's transform engine — treated as degrees */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: cover.floatDuration, repeat: Infinity, ease: 'easeInOut', delay: cover.floatDelay }}
        style={{ rotate: cover.rotate }}
      >
        <img
          src={`https://picsum.photos/seed/${cover.seed}/240/336`}
          alt=""
          width={240}
          height={336}
          className={`${sizeClasses[cover.size]} object-cover rounded shadow-[0_8px_24px_-4px_rgba(13,13,13,0.2)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function BookCovers() {
  return (
    <div aria-hidden="true" className="flex gap-3 justify-end select-none">
      <div className="flex flex-col gap-3">
        {col0.map((cover) => <Cover key={cover.seed} cover={cover} />)}
      </div>
      <div className="flex flex-col gap-3 mt-10">
        {col1.map((cover) => <Cover key={cover.seed} cover={cover} />)}
      </div>
    </div>
  );
}
