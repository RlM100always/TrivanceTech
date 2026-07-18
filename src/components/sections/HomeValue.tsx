import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Clock, Users } from 'lucide-react';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

/**
 * HomeValue — the Home page value proposition.
 *
 * Replaces the near-empty `<PremiumAbout compact />` teaser with a bold, editorial
 * statement (left-aligned, for rhythm variety against the centered SectionHeadings
 * elsewhere) plus three large pillars that fold in the strongest differentiators
 * from WhyChooseUs. Fewer, bigger blocks — the hero-forward register.
 */

const PILLARS = [
  {
    icon: Award,
    title: 'Quality, engineered in',
    description:
      'Clean architecture, tested code and design-system rigor on every build — not a rushed template, but software made to last and scale.',
  },
  {
    icon: Clock,
    title: 'Shipped on time',
    description:
      'Clear milestones and honest timelines. We respect deadlines and deliver on — or before — the date we agreed, every time.',
  },
  {
    icon: Users,
    title: 'A senior team, end to end',
    description:
      'Experienced engineers and designers across web, mobile and AI who own your product from first idea to launch and beyond.',
  },
];

const HomeValue: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white py-20 dark:bg-neutral-900 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Editorial statement */}
          <Reveal direction="up" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-300">
              The Difference
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              We don't just write code.{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                We build products that move your business.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              A remote-first studio partnering with founders and teams worldwide — turning bold
              ideas into launched, cloud-native software.
            </p>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center text-base font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Meet the team behind the work
              <ArrowRight size={18} className="ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* Pillars */}
          <StaggerContainer className="space-y-5 lg:col-span-7" stagger={0.1}>
            {PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Tilt max={5}>
                  <SpotlightCard
                    glowColor="rgba(99, 102, 241, 0.16)"
                    className="rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-neutral-800/60"
                  >
                    <div className="flex items-start gap-5 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700 sm:p-8">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
                        <pillar.icon size={26} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </Tilt>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default HomeValue;
