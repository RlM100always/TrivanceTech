import React from 'react';
import { Search, FileText, Code2, Rocket, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';

/**
 * ProcessSection — "How we work".
 *
 * Four steps, each a numbered circle + icon, connected by arrows on desktop —
 * mirroring the studio-site reference's compact "01 → 02 → 03 → 04" layout.
 */

const STEPS = [
  {
    icon: Search,
    title: 'Discover',
    description: 'We dive deep into your users, market and goals to uncover real opportunities.',
  },
  {
    icon: FileText,
    title: 'Design',
    description: 'We define the right solution with a clear scope, roadmap and success metrics.',
  },
  {
    icon: Code2,
    title: 'Build',
    description: 'We design and engineer in agile sprints with transparency at every step.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'We launch with confidence and support growth with continuous improvement.',
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white/80 py-20 backdrop-blur-xl dark:bg-neutral-900/40 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title="From idea to launch, without the chaos."
          highlight="without the chaos"
          description="A calm, transparent process that keeps you in the loop and gets your product live without surprises."
        />

        <StaggerContainer
          className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-4"
          stagger={0.12}
        >
          {STEPS.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-sm font-bold text-primary-600 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <step.icon size={20} className="text-neutral-400 dark:text-neutral-500" />
                  {i < STEPS.length - 1 && (
                    <ArrowRight size={16} className="hidden text-neutral-300 dark:text-neutral-700 lg:block" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
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
