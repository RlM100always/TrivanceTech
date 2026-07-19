import React from 'react';
import { ArrowUpRight, GraduationCap, Palette, Code, Smartphone, Brain, Shield, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';

interface PremiumServicesProps {
  /** Show only the first N services with a "View all services" link, instead of the full grid + CTA banner. Use on Home; the full list lives on /services. */
  limit?: number;
}

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom websites and web applications built with cutting-edge technologies.',
    tags: ['Web apps', 'SaaS', 'Performance'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    tags: ['iOS', 'Android', 'Cross-platform'],
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions and automations that streamline workflows and unlock value.',
    tags: ['Machine learning', 'RAG', 'Agents'],
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions and vulnerability assessments.',
    tags: ['Audits', 'Pen testing', 'Compliance'],
  },
  {
    icon: Database,
    title: 'Database Solutions',
    description: 'Robust database design, optimization, and management.',
    tags: ['Design', 'Tuning', 'Migration'],
  },
  {
    icon: GraduationCap,
    title: 'Academic Projects & Thesis',
    description: 'Professional assistance for university students with projects and thesis work.',
    tags: ['Research', 'Thesis', 'Assignments'],
  },
  {
    icon: Palette,
    title: 'UI & UX Design',
    description: 'Beautiful, intuitive interfaces that deliver exceptional user experiences.',
    tags: ['User flows', 'Prototypes', 'Design systems'],
  },
];

const PremiumServices: React.FC<PremiumServicesProps> = ({ limit }) => {
  const visibleServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="overflow-hidden bg-white/80 py-20 backdrop-blur-xl dark:bg-neutral-950/50 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="One team. Every skill your product needs."
          highlight="Every skill"
          description="No hand-offs between agencies, no gaps between web, mobile and AI. Just one senior team that ships all of it — and ships it well."
        >
          {limit && (
            <Link
              to="/services"
              className="mt-4 inline-flex items-center font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              See everything we do <ArrowUpRight size={18} className="ml-1" />
            </Link>
          )}
        </SectionHeading>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {visibleServices.map((service) => (
            <StaggerItem key={service.title}>
              <div className="group relative h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-primary-500/40">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <service.icon size={20} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-neutral-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-500 dark:text-neutral-600"
                  />
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {service.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Section — Home already has its own CallToAction section, so skip this banner when limited */}
        {!limit && (
          <div className="mt-16 sm:mt-20">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white md:p-12 sm:p-8">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 text-center">
                <h3 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Not sure which service you need?</h3>
                <p className="mb-6 max-w-2xl px-4 text-lg opacity-90 sm:mb-8 sm:text-xl">
                  Tell us what you're trying to build — we'll scope it, quote it, and tell you honestly if it's a fit. No pressure, no obligation.
                </p>
                <div className="flex flex-col justify-center gap-4 px-4 sm:flex-row">
                  <Link
                    to="/order"
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-100 sm:px-8 sm:py-4"
                  >
                    Start Your Project
                  </Link>
                  <Link
                    to="/projects"
                    className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:px-8 sm:py-4"
                  >
                    View Our Work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumServices;
