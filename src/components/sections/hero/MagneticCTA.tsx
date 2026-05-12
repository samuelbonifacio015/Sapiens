import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

export default function MagneticCTA({ href, children, variant = 'primary', target, rel, 'aria-label': ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm tracking-wide rounded hover:bg-[#1A1A1A] active:scale-[0.98] transition-colors'
      : 'inline-flex items-center justify-center gap-2 px-6 py-4 text-[#5C5C5C] font-inter font-medium text-sm hover:text-[#0D0D0D] active:scale-[0.98] transition-colors';

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={resolvedRel}
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}
