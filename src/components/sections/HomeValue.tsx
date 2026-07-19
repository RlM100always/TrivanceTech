import React from 'react';
import { Award, Clock, Users, Sparkles } from 'lucide-react';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';

/**
 * HomeValue — "Why teams choose us".
 *
 * Left: a short editorial statement. Right: three compact pillar cards in a
 * row, mirroring the studio-site reference layout (eyebrow + heading left,
 * a tight row of icon cards right).
 */

const PILLARS = [
  {
    icon: Award,
    title: 'Quality engineered in',
    description: 'We build with quality from day one — secure, tested, accessible and built to last.',
  },
  {
    icon: Clock,
    title: 'Shipped on time',
    description: 'Clear plans, agile execution and proactive communication keep projects on track.',
  },
  {
    icon: Users,
    title: 'Senior team end to end',
    description: 'Work directly with experienced strategists, designers and engineers — no hand-offs.',
  },
];

const HomeValue: React.FC = () => {
  return (
    <section className="overflow-hidden bg-neutral-50/80 py-20 backdrop-blur-xl dark:bg-neutral-950/50 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Editorial statement */}
          <Reveal direction="up" className="lg:col-span-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400">
              <Sparkles size={13} />
              Why Teams Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Senior thinking.{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Shipping discipline.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              We combine product strategy with deep engineering expertise and AI capability to
              build products that solve real problems and scale with confidence.
            </p>
          </Reveal>

          {/* Pillars */}
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8" stagger={0.1}>
            {PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <pillar.icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {pillar.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default HomeValue;
