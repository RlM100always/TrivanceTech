import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * TrustStrip — "Technologies we use".
 *
 * Two edge-faded marquee rows (scrolling in opposite directions) of the real
 * brand logos in our stack. Logos come from the Iconify API as colored SVGs;
 * the few that are pure-black get `dark:invert` so they stay visible in dark
 * mode. Freezes into a static wrapped grid when the user prefers reduced motion.
 */

interface Tech {
  name: string;
  /** Iconify id, e.g. "logos:python" */
  id: string;
  /** hex (no #) to tint monochrome simple-icons */
  color?: string;
  /** pure-black logo → invert in dark mode so it stays visible */
  invert?: boolean;
}

const iconUrl = ({ id, color }: Tech) =>
  `https://api.iconify.design/${id.replace(':', '/')}.svg${color ? `?color=%23${color}` : ''}`;

const TECH: Tech[] = [
  { name: 'Python', id: 'logos:python' },
  { name: 'Java', id: 'logos:java' },
  { name: 'Kotlin', id: 'logos:kotlin-icon' },
  { name: 'JavaScript', id: 'logos:javascript' },
  { name: 'TypeScript', id: 'logos:typescript-icon' },
  { name: 'React', id: 'logos:react' },
  { name: 'Next.js', id: 'logos:nextjs-icon', invert: true },
  { name: 'Node.js', id: 'logos:nodejs-icon' },
  { name: 'Tailwind CSS', id: 'logos:tailwindcss-icon' },
  { name: 'Git', id: 'logos:git-icon' },
  { name: 'GitHub', id: 'logos:github-icon', invert: true },
  { name: 'VS Code', id: 'logos:visual-studio-code' },
  { name: 'Figma', id: 'logos:figma' },
  { name: 'Docker', id: 'logos:docker-icon' },
  { name: 'PostgreSQL', id: 'logos:postgresql' },
  { name: 'Notion', id: 'logos:notion-icon', invert: true },
  { name: 'Google Docs', id: 'simple-icons:googledocs', color: '4285F4' },
  { name: 'Google Drive', id: 'logos:google-drive' },
  { name: 'Excel', id: 'vscode-icons:file-type-excel' },
  { name: 'n8n', id: 'simple-icons:n8n', color: 'EA4B71' },
];

const Chip: React.FC<{ tech: Tech }> = ({ tech }) => (
  <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]">
    <img
      src={iconUrl(tech)}
      alt={tech.name}
      loading="lazy"
      width={22}
      height={22}
      className={`h-[22px] w-[22px] object-contain ${tech.invert ? 'dark:invert' : ''}`}
    />
    <span className="whitespace-nowrap text-sm font-semibold text-neutral-700 dark:text-neutral-200">
      {tech.name}
    </span>
  </div>
);

const Row: React.FC<{ items: Tech[]; reverse?: boolean; reduce: boolean }> = ({ items, reverse, reduce }) => {
  if (reduce) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((t) => (
          <Chip key={t.name} tech={t} />
        ))}
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((t, i) => (
          <Chip key={`${t.name}-${i}`} tech={t} />
        ))}
      </motion.div>
    </div>
  );
};

const TrustStrip: React.FC = () => {
  const reduce = useReducedMotion() ?? false;
  const mid = Math.ceil(TECH.length / 2);
  const rowA = TECH.slice(0, mid);
  const rowB = TECH.slice(mid);

  return (
    <section className="border-y border-neutral-200 bg-neutral-50/80 py-14 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/50 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Technologies we use
        </p>

        <div className="space-y-4">
          <Row items={rowA} reduce={reduce} />
          <Row items={rowB} reverse reduce={reduce} />
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
