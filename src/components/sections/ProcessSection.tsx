import React from 'react';
import { Compass, PenTool, Code2, Rocket } from 'lucide-react';
import SectionHeading from '../ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';

/**
 * ProcessSection — "How we work".
 *
 * Four large numbered steps with generous whitespace, giant index numerals and a
 * connective line on desktop. Part of the hero-forward Home arc: fewer, bigger,
 * more editorial blocks rather than another dense card grid.
 */

const STEPS = [
  {
    icon: Compass,
    title: 'Discover',
    description: 'We dig into your goals, users and constraints — then map the fastest path from idea to impact.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Wireframes, prototypes and a premium UI system, validated with you before a line of code ships.',
  },
  {
    icon: Code2,
    title: 'Build',
    description: 'Senior engineers build in tested, reviewable increments — you see real progress every week.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'We deploy to cloud-native infrastructure, hand over cleanly and stay on for support and growth.',
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white py-20 dark:bg-neutral-900 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How We Work"
          title="From idea to launch, in four steps"
          highlight="four steps"
          description="A calm, transparent process that keeps you in the loop and gets your product live without surprises."
        />

        <StaggerContainer
          className="relative mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.12}
        >
          {/* Connective line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-700 lg:block"
          />

          {STEPS.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="relative flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                    <step.icon size={26} className="text-white" />
                  </div>
                  <span className="font-display text-6xl font-bold leading-none text-neutral-100 dark:text-neutral-800">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-neutral-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default ProcessSection;
