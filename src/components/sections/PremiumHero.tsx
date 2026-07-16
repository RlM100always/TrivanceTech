import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Globe, Users, Award } from 'lucide-react';
import HeroScene from '../three/HeroScene';
import MagneticButton from '../ui/motion/MagneticButton';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Deterministic particle field — computed once so it never re-randomizes on
// re-render (the old Math.random()-in-render approach made particles jump).
const PARTICLES = Array.from({ length: 50 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = (n: number) => {
    const v = (seed * (n + 1)) % 1000 / 1000;
    return v;
  };
  return {
    id: i,
    left: rnd(1) * 100,
    top: rnd(2) * 100,
    delay: rnd(3) * 3,
    duration: 2 + rnd(4) * 3,
    size: 1 + rnd(5) * 2,
    opacity: 0.1 + rnd(6) * 0.25,
  };
});

const PremiumHero: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    'International Students',
    'Business Owners',
    'Entrepreneurs',
    'Startups',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Award, value: '50+', label: 'Projects Delivered' },
    { icon: Users, value: '15+', label: 'Happy Clients' },
    { icon: Globe, value: '5+', label: 'Countries Served' },
    { icon: Sparkles, value: '4+', label: 'Years Excellence' },
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-900 to-primary-800 dark:from-neutral-950 dark:via-primary-950 dark:to-primary-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-neutral-900/90 dark:from-primary-950/95 dark:to-neutral-950/95" />

        {/* Premium Three.js constellation layer — lazy-loaded, skipped for reduced-motion/no-WebGL */}
        <HeroScene className="absolute inset-0 opacity-70" />

        {/* Drifting aurora */}
        <div className="absolute inset-0">
          <div className="aurora-blob absolute -left-1/4 top-0 h-[55vh] w-[55vh] rounded-full bg-primary-500/20 blur-3xl" />
          <div className="aurora-blob absolute -right-1/4 bottom-0 h-[55vh] w-[55vh] rounded-full bg-primary-500/20 blur-3xl" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Deterministic floating particles */}
        <div className="absolute inset-0">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm sm:mb-8"
          >
            <Sparkles size={14} className="mr-2" />
            <span className="leading-tight">IT Solutions Agency</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeUp}
            className="mb-4 px-2 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Empowering the Future with
            <span className="mt-2 block bg-gradient-to-r from-primary-400 via-primary-400 to-primary-300 bg-clip-text text-transparent animate-gradient-x">
              Innovative Software Solutions
            </span>
          </motion.h1>

          {/* Dynamic Subheading */}
          <motion.div variants={fadeUp} className="mb-2 h-8 px-4 text-lg text-neutral-200 sm:mb-4 md:text-2xl">
            <span>Trusted by </span>
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingTexts[currentText]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block font-semibold text-primary-300"
                >
                  {rotatingTexts[currentText]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-3xl px-4 text-base leading-relaxed text-neutral-300 sm:mb-12 md:text-xl"
          >
            Remote-first, we deliver cutting-edge web development, mobile applications,
            digital transformation services, university projects, thesis, assignments, and UI/UX design that drive success globally.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="mb-12 flex flex-col items-center justify-center gap-4 px-4 sm:mb-16 sm:flex-row sm:gap-6"
          >
            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <Link
                to="/order"
                className="group flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-primary-700 hover:shadow-primary-500/25 sm:px-8 sm:py-4"
              >
                Get Started Today
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>

            <MagneticButton strength={0.4} className="w-full sm:w-auto">
              <button className="group flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20 sm:px-8 sm:py-4">
                <Play size={20} className="mr-2 transition-transform group-hover:scale-110" />
                Watch Our Story
              </button>
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:gap-8 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-16 sm:w-16">
                  <stat.icon className="h-6 w-6 text-primary-400 sm:h-8 sm:w-8" />
                </div>
                <div className="mb-1 text-2xl font-bold text-white sm:mb-2 sm:text-3xl">{stat.value}</div>
                <div className="text-xs text-neutral-300 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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

export default PremiumHero;
