import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import ProductFactoryScene from '../three/ProductFactoryScene';
import MagneticButton from '../ui/motion/MagneticButton';

/**
 * ProductFactoryHero — a calm, premium hero.
 *
 * A single full-height section: refined Three.js backdrop behind a centered
 * headline, subheading and CTAs. Falls back to the same layout without the 3D
 * canvas when WebGL is unavailable or the user prefers reduced motion.
 */

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '15+', label: 'Happy Clients' },
  { value: '5+', label: 'Countries Served' },
  { value: '99%', label: 'Client Satisfaction' },
];

// Rotating headlines — brand voice: problem-solving, product-building.
const TAGLINES = [
  { lead: 'We Solve Real Problems,', accent: 'Not Just Code.' },
  { lead: 'We Turn Bold Ideas', accent: 'Into Real Products.' },
  { lead: 'We Ship Software', accent: 'That Actually Scales.' },
  { lead: 'We Engineer Growth,', accent: 'Not Just Features.' },
  { lead: 'From Idea to Launch,', accent: 'We Build It All.' },
];

// Typewriter timing (ms).
const TYPE_SPEED = 55; // per character while typing
const DELETE_SPEED = 28; // per character while erasing
const HOLD_FULL = 1700; // pause once a tagline is fully typed
const HOLD_EMPTY = 400; // pause before the next tagline starts

/** Blinking typewriter caret. Uses a background bar (not text color) so it
 *  stays visible even inside the gradient `text-transparent` accent line. */
const Caret: React.FC<{ color?: string }> = ({ color = 'bg-white' }) => (
  <motion.span
    aria-hidden
    className={`ml-1 inline-block h-[0.82em] w-[0.06em] translate-y-[0.06em] rounded-sm align-middle ${color}`}
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
  />
);

const ProductFactoryHero: React.FC = () => {
  const [use3D, setUse3D] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [count, setCount] = useState(0); // characters currently revealed
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(reduce);
    if (!reduce && supportsWebGL()) setUse3D(true);
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

  // Split the revealed characters across the two lines.
  const shown = reduceMotion ? total : count;
  const leadShown = active.lead.slice(0, Math.min(shown, active.lead.length));
  const accentRevealed = Math.max(0, shown - active.lead.length);
  const accentShown = active.accent.slice(0, accentRevealed);
  const cursorOnAccent = accentRevealed > 0;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 via-primary-950 to-neutral-950">
      {/* 3D backdrop */}
      {use3D && <ProductFactoryScene className="absolute inset-0 opacity-60" />}

      {/* Soft aurora + vignette + central scrim so text stays legible */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 h-[45vh] w-[45vh] rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-[45vh] w-[45vh] rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/85" />
        {/* Radial darkening centered behind the copy for contrast */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 55% at 50% 45%, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.35) 45%, transparent 75%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-lg shadow-primary-500/10 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
            </span>
            Digital Product Studio
            <Sparkles size={14} className="text-primary-400" />
          </motion.span>

          {/* Typewriter headline — characters type in / erase, with a blinking
              caret. Fixed min-height so the lines below never shift. */}
          <motion.div
            variants={fadeUp}
            className="mb-8 flex min-h-[8.5rem] items-center justify-center sm:min-h-[12rem] lg:min-h-[15rem]"
            aria-live="polite"
          >
            <h1
              className="text-5xl font-bold leading-[1.02] tracking-tighter text-white sm:text-7xl lg:text-8xl"
              style={{ textShadow: '0 2px 30px rgba(2,6,23,0.9)' }}
              aria-label={`${active.lead} ${active.accent}`}
            >
              <span>
                {leadShown}
                {!cursorOnAccent && <Caret />}
              </span>
              <span className="mt-2 block min-h-[1.1em] bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                {accentShown}
                {cursorOnAccent && <Caret color="bg-primary-400" />}
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-neutral-200/90 sm:text-xl"
            style={{ textShadow: '0 1px 20px rgba(2,6,23,0.8)' }}
          >
            From a single idea to a launched, cloud-native platform — we design, engineer and ship
            SaaS, AI and software products that move your business forward.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <Link
                to="/order"
                className="group flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-primary-700 hover:shadow-primary-500/30"
              >
                Start Your Project
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>

            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <Link
                to="/contact"
                className="group flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/20"
              >
                <Play size={18} className="mr-2 transition-transform group-hover:scale-110" />
                Get In Touch
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-y-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-md sm:gap-y-0"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex w-1/2 flex-col items-center px-4 sm:w-auto sm:flex-1 ${
                  i > 0 ? 'sm:border-l sm:border-white/10' : ''
                }`}
              >
                <div className="bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-neutral-400 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
          <motion.div
            className="mt-2 h-3 w-1 rounded-full bg-white/50"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default ProductFactoryHero;
