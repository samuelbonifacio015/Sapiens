# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static, generic Hero.astro with an asymmetric editorial hero featuring Playfair Display at scale, a lime accent moment on "que Lima", real picsum book cover imagery with infinite float, and Framer Motion staggered entry — all as a React island in Astro.

**Architecture:** Hero.astro becomes a thin Astro shell (`<section>` wrapper only) that hydrates a React island `HeroClient` with `client:load`. HeroClient is split into three isolated leaf components: `BookCovers` (perpetual float animation, completely isolated to avoid parent re-renders), `MagneticCTA` (magnetic button via useMotionValue, no useState), and `HeroClient` itself (staggered heading + subtext entry). No `'use client'` directive needed — this is Astro, not Next.js.

**Tech Stack:** Astro 6, React 19, Tailwind CSS v3, Framer Motion (to install)

---

### Task 0: Install Framer Motion

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Verify it's in dependencies**

```bash
grep framer-motion package.json
```

Expected: `"framer-motion": "^..."` in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion for hero animations"
```

---

### Task 1: Create BookCovers — isolated perpetual motion component

**Files:**
- Create: `src/components/sections/hero/BookCovers.tsx`

5 book covers in a 2-column asymmetric grid. Column 1 has 2 covers flush to top. Column 2 has 3 covers offset 40px down. Each cover floats infinitely at a different speed and amplitude. Staggered fade-up entry on mount. No React state — animation driven purely by Framer Motion's animate prop.

- [ ] **Step 1: Create `src/components/sections/hero/BookCovers.tsx`**

```tsx
import { motion } from 'framer-motion';

const covers = [
  { seed: 'ciudad-perros-mvll',    rotate: -2, entryDelay: 0.40, floatDuration: 3.6, floatDelay: 0.0, col: 0, size: 'lg' },
  { seed: 'conversacion-catedral', rotate:  3, entryDelay: 0.50, floatDuration: 4.1, floatDelay: 0.8, col: 1, size: 'md' },
  { seed: 'casa-verde-vargas',     rotate:  1, entryDelay: 0.45, floatDuration: 3.9, floatDelay: 0.4, col: 0, size: 'md' },
  { seed: 'cien-anos-soledad',     rotate: -1, entryDelay: 0.55, floatDuration: 4.4, floatDelay: 1.2, col: 1, size: 'lg' },
  { seed: 'ficciones-borges-arg',  rotate:  2, entryDelay: 0.60, floatDuration: 3.3, floatDelay: 0.2, col: 1, size: 'sm' },
];

const sizeClasses = {
  lg: 'w-32 h-44 sm:w-36 sm:h-52',
  md: 'w-28 h-40 sm:w-32 sm:h-44',
  sm: 'w-24 h-32 sm:w-28 sm:h-36',
};

export default function BookCovers() {
  const col0 = covers.filter(c => c.col === 0);
  const col1 = covers.filter(c => c.col === 1);

  return (
    <div className="flex gap-3 justify-end select-none" aria-hidden="true">
      {/* Column 0 */}
      <div className="flex flex-col gap-3">
        {col0.map((cover) => (
          <motion.div
            key={cover.seed}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: cover.entryDelay }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: cover.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: cover.floatDelay,
              }}
              style={{ rotate: cover.rotate }}
            >
              <img
                src={`https://picsum.photos/seed/${cover.seed}/240/336`}
                alt=""
                width={240}
                height={336}
                className={`${sizeClasses[cover.size as keyof typeof sizeClasses]} object-cover rounded shadow-[0_8px_24px_-4px_rgba(13,13,13,0.20)]`}
                loading="eager"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Column 1 — offset down */}
      <div className="flex flex-col gap-3 mt-10">
        {col1.map((cover) => (
          <motion.div
            key={cover.seed}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: cover.entryDelay }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: cover.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: cover.floatDelay,
              }}
              style={{ rotate: cover.rotate }}
            >
              <img
                src={`https://picsum.photos/seed/${cover.seed}/240/336`}
                alt=""
                width={240}
                height={336}
                className={`${sizeClasses[cover.size as keyof typeof sizeClasses]} object-cover rounded shadow-[0_8px_24px_-4px_rgba(13,13,13,0.20)]`}
                loading="eager"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/hero/BookCovers.tsx
git commit -m "feat: add BookCovers isolated float animation component"
```

---

### Task 2: Create MagneticCTA — isolated magnetic button

**Files:**
- Create: `src/components/sections/hero/MagneticCTA.tsx`

Magnetic pull effect using `useMotionValue` + `useSpring` + `useTransform`. Position updates happen outside the React render cycle — no useState. Two variants: primary (dark bg) and ghost (text only).

- [ ] **Step 1: Create `src/components/sections/hero/MagneticCTA.tsx`**

```tsx
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
}

export default function MagneticCTA({ href, children, variant = 'primary' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const primaryClass =
    'inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0D0D0D] text-[#F8F8F5] font-inter font-medium text-sm tracking-wide rounded hover:bg-[#1A1A1A] active:scale-[0.98] transition-colors';

  const ghostClass =
    'inline-flex items-center justify-center gap-2 px-6 py-4 text-[#5C5C5C] font-inter font-medium text-sm hover:text-[#0D0D0D] active:scale-[0.98] transition-colors';

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={variant === 'primary' ? primaryClass : ghostClass}
    >
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/hero/MagneticCTA.tsx
git commit -m "feat: add MagneticCTA magnetic button component"
```

---

### Task 3: Create HeroClient — main React island

**Files:**
- Create: `src/components/sections/hero/HeroClient.tsx`

Orchestrates the full hero layout: 3/5 left (heading + subtext + CTAs) and 2/5 right (BookCovers). Heading animates in 3 lines with stagger. Line 2 ("que Lima") has a lime underline that draws in after the line appears. Stat line fades in last. Book covers column hidden on mobile.

- [ ] **Step 1: Create `src/components/sections/hero/HeroClient.tsx`**

```tsx
import { motion } from 'framer-motion';
import BookCovers from './BookCovers';
import MagneticCTA from './MagneticCTA';

const headingLines = [
  { text: 'Los libros',          limeUnderline: false },
  { text: 'que Lima',            limeUnderline: true  },
  { text: 'estaba esperando.',   limeUnderline: false },
];

export default function HeroClient() {
  return (
    <div className="max-w-[1280px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center py-24 lg:py-32">

        {/* Left: editorial text */}
        <div className="flex flex-col gap-6">

          {/* Heading */}
          <h1 className="font-playfair font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-[#0D0D0D] leading-[1.05] tracking-tight">
            {headingLines.map((line, i) => (
              <motion.span
                key={line.text}
                className="relative block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              >
                {line.text}
                {line.limeUnderline && (
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

          {/* Subtext */}
          <motion.p
            className="font-inter text-[#5C5C5C] text-lg leading-relaxed max-w-[42ch]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          >
            Más de 2,000 títulos. Envíos a Lima y provincias.
          </motion.p>

          {/* CTAs */}
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

          {/* Stat label */}
          <motion.p
            className="font-inter text-xs text-[#5C5C5C] tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.90 }}
          >
            Libros &middot; Revistas &middot; Digital &middot; Físico
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/hero/HeroClient.tsx
git commit -m "feat: add HeroClient main island with staggered entry and lime accent"
```

---

### Task 4: Update Hero.astro — thin shell

**Files:**
- Modify: `src/components/sections/Hero.astro`

Replace all 72 lines with a minimal Astro wrapper that hydrates the React island.

- [ ] **Step 1: Replace `Hero.astro` content entirely**

```astro
---
import HeroClient from './hero/HeroClient';
---

<section class="relative bg-bg overflow-hidden">
  <HeroClient client:load />
</section>
```

- [ ] **Step 2: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:4321` and verify:

| Check | Expected |
|---|---|
| Heading layout | 3 lines, left-aligned, Playfair, ~72px on desktop |
| Lime underline | Draws in under "que Lima" ~0.55s after load |
| Book covers | Asymmetric 2-col grid, visible on lg+, floating |
| CTAs | Dark primary + ghost secondary, magnetic on hover |
| Mobile `< 768px` | Single column, book covers hidden, no horizontal scroll |
| No layout jump | No `h-screen` flash, section grows to content |

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat: replace hero static content with React island — editorial asymmetric layout"
```

---

## Self-Review

**Spec coverage:**
- Asymmetric 3/5+2/5 layout: Task 3 ✓
- Lime accent moment: Task 3, limeUnderline on "que Lima" ✓
- Framer Motion staggered entry: Task 3, headingLines map + motion.p ✓
- BookCovers with infinite float: Task 1 ✓
- Magnetic CTA: Task 2 ✓
- Mobile collapse: Task 3, `hidden lg:flex` on covers col, single grid-cols-1 ✓
- No h-screen: `py-24 lg:py-32` on the grid div, no min-h-screen ✓
- New copy: "Los libros que Lima estaba esperando." / "Más de 2,000 títulos." ✓
- Framer Motion install: Task 0 ✓

**Placeholder scan:** No TBD, no TODO, no "similar to above", no incomplete steps.

**Type consistency:** `covers` array uses `col: 0 | 1`, `size: 'lg' | 'md' | 'sm'` — consistent across `sizeClasses` lookup and filter.
