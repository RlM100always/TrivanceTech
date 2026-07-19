import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, Globe2, ShieldCheck } from 'lucide-react';
import MagneticButton from '../ui/motion/MagneticButton';
import CodeShowcase from './CodeShowcase';
import { staggerContainer, reveal } from '../../lib/motion';

/**
 * ProductFactoryHero — the home hero copy: plain uppercase eyebrow, a large
 * headline that types in with a gradient accent phrase, two CTAs and an icon
 * stat row. The visual is the page-wide HomeAtmosphere flowing behind it (this
 * section is transparent), so there is no boxed canvas here.
 */

const stagger = staggerContainer(0.1, 0.1);
const fadeUp = reveal({ direction: 'up', distance: 20, duration: 0.55 });

const stats = [
  { value: '50+', label: 'Projects delivered', icon: Building2 },
  { value: '15+', label: 'Industries served', icon: Users },
  { value: '5+', label: 'Countries reached', icon: Globe2 },
  { value: '99%', label: 'Client satisfaction', icon: ShieldCheck },
];

// Rotating headlines — the first matches the reference exactly.
const TAGLINES = [
  { lead: 'We turn ambitious ideas into ', accent: 'intelligent products.' },
  { lead: 'We solve real problems, ', accent: 'not just write code.' },
  { lead: 'We ship software ', accent: 'that actually scales.' },
  { lead: 'From idea to launch, ', accent: 'we build it all.' },
];

// Typewriter timing (ms).
const TYPE_SPEED = 48;
const DELETE_SPEED = 24;
const HOLD_FULL = 2000;
const HOLD_EMPTY = 400;

/** Blinking typewriter caret — a background bar so it stays visible even inside
 *  the gradient `text-transparent` accent line. */
const Caret: React.FC<{ color?: string }> = ({ color = 'bg-neutral-900 dark:bg-white' }) => (
  <motion.span
    aria-hidden
    className={`ml-1 inline-block h-[0.8em] w-[0.055em] translate-y-[0.05em] rounded-sm align-middle ${color}`}
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
  />
);

const ProductFactoryHero: React.FC = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [count, setCount] = useState(0); // characters currently revealed
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const active = TAGLINES[taglineIndex];
  const total = active.lead.length + active.accent.length;

  // Typewriter state machine: type → hold → delete → next.
  useEffect(() => {
    if (reduceMotion) return;
    let delay: number;
    if (!deleting && count < total) delay = TYPE_SPEED;
    else if (!deleting) delay = HOLD_FULL;
    else if (count > 0) delay = DELETE_SPEED;
    else delay = HOLD_EMPTY;

    const t = setTimeout(() => {
      if (!deleting && count < total) setCount((c) => c + 1);
      else if (!deleting) setDeleting(true);
      else if (count > 0) setCount((c) => c - 1);
      else {
        setDeleting(false);
        setTaglineIndex((i) => (i + 1) % TAGLINES.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [count, deleting, total, reduceMotion]);

  const shown = reduceMotion ? total : count;
  const leadShown = active.lead.slice(0, Math.min(shown, active.lead.length));
  const accentRevealed = Math.max(0, shown - active.lead.length);
  const accentShown = active.accent.slice(0, accentRevealed);
  const cursorOnAccent = accentRevealed > 0;

  return (
    <section className="relative overflow-hidden bg-transparent pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
        {/* Copy */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
          <motion.span
            variants={fadeUp}
            className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400"
          >
            AI &amp; Digital Product Studio
          </motion.span>

          {/* Typewriter headline — types in / erases with a blinking caret.
              Fixed min-height so the CTAs below never shift. */}
          <motion.h1
            variants={fadeUp}
            className="min-h-[10rem] text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 dark:text-white sm:min-h-[13rem] sm:text-5xl lg:min-h-[15.5rem] lg:text-6xl xl:text-[4.25rem]"
            aria-label={`${active.lead}${active.accent}`}
            aria-live="polite"
          >
            <span>
              {leadShown}
              {!cursorOnAccent && <Caret />}
            </span>
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-500 bg-clip-text text-transparent dark:from-primary-400 dark:via-secondary-400 dark:to-primary-300">
              {accentShown}
              {cursorOnAccent && <Caret color="bg-secondary-500 dark:bg-secondary-400" />}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg lg:mx-0"
          >
            Strategy, design, engineering and AI — united in one senior team.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <motion.div whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                <Link
                  to="/order"
                  className="group flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700 hover:shadow-xl"
                >
                  Start a project
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </MagneticButton>

            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <motion.div whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                <Link
                  to="/projects"
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3.5 font-semibold text-neutral-800 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/5"
                >
                  View our work
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </MagneticButton>
          </motion.div>

          {/* Stat row */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-x-4 lg:mx-0 lg:max-w-none"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 lg:items-start">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                  <s.icon size={16} strokeWidth={2.2} className="text-primary-600 dark:text-primary-400" />
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated coding window */}
        <div className="mt-6 lg:mt-0">
          <CodeShowcase />
        </div>
      </div>
    </section>
  );
};

export default ProductFactoryHero;
