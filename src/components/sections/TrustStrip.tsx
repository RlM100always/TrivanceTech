import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * TrustStrip — a thin, understated band directly under the hero.
 *
 * A short trust line plus a seamless auto-scrolling marquee of the tech stack /
 * capabilities we build with. Deliberately quiet (mono palette, low contrast) so
 * it reassures without competing with the hero. Freezes when the user prefers
 * reduced motion.
 */

const STACK = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'AWS',
  'Cloudflare', 'PostgreSQL', 'TensorFlow', 'React Native', 'Docker', 'Figma',
];

const Track: React.FC<{ 'aria-hidden'?: boolean }> = (props) => (
  <div className="flex shrink-0 items-center gap-10 px-5" {...props}>
    {STACK.map((name) => (
      <span
        key={name}
        className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
      >
        {name}
      </span>
    ))}
  </div>
);

const TrustStrip: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-neutral-200 bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Trusted by teams worldwide · Built with a modern, battle-tested stack
        </p>

        {/* Edge-faded marquee */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          {reduce ? (
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
              <Track />
            </div>
          ) : (
            <motion.div
              className="flex w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              <Track />
              <Track aria-hidden />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
