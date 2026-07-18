import React, { useState } from 'react';
import { Zap, ChevronRight, CheckCircle, GraduationCap, Palette, Code, Smartphone, Brain, Shield, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/motion/SectionHeading';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

interface PremiumServicesProps {
  /** Show only the first N services with a "View all services" link, instead of the full grid + CTA banner. Use on Home; the full list lives on /services. */
  limit?: number;
}

const PremiumServices: React.FC<PremiumServicesProps> = ({ limit }) => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  // Mono system: every card shares the single brand hue. Icons stay distinct by
  // shape, not colour — that's the premium (Linear/Vercel) register.
  const ICON_GRADIENT = 'from-primary-500 to-primary-700';
  const ICON_TEXT = 'text-primary-600 dark:text-primary-400';
  const ICON_GLOW = 'rgba(99, 102, 241, 0.18)';

  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with cutting-edge technologies',
      features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimization', 'Performance Focused'],
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      features: ['Native iOS & Android', 'Cross-platform Solutions', 'UI/UX Excellence', 'App Store Optimization'],
    },
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by artificial intelligence',
      features: ['Custom AI Models', 'Data Analytics', 'Automation', 'Predictive Analysis'],
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions and vulnerability assessments',
      features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Risk Assessment'],
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design, optimization, and management',
      features: ['Database Design', 'Performance Tuning', 'Data Migration', 'Backup Solutions'],
    },
    {
      icon: GraduationCap,
      title: 'Academic Projects & Thesis',
      description: 'Professional assistance for university students with projects, thesis, and assignments',
      features: ['Research Projects', 'Thesis Writing', 'Assignment Help', 'Academic Consultation'],
    },
    {
      icon: Palette,
      title: 'UI & UX Design',
      description: 'Beautiful and intuitive user interfaces that deliver exceptional user experiences',
      features: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Design Systems'],
    },
  ].map((s) => ({ ...s, color: ICON_GRADIENT, textColor: ICON_TEXT, glow: ICON_GLOW }));

  const visibleServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="overflow-hidden bg-neutral-50 py-16 dark:bg-neutral-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Build"
          eyebrowIcon={<Zap size={16} className="mr-1" />}
          title="One team. Every skill your product needs."
          highlight="Every skill"
          description="No hand-offs between agencies, no gaps between web, mobile and AI. Just one senior team that ships all of it — and ships it well."
        >
          {limit && (
            <Link
              to="/services"
              className="mt-4 inline-flex items-center font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              See everything we do <ChevronRight size={18} className="ml-1" />
            </Link>
          )}
        </SectionHeading>

        {/* Services Grid */}
        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.07}>
          {visibleServices.map((service, index) => (
            <StaggerItem key={index}>
              <Tilt max={8} className="h-full">
                <SpotlightCard glowColor={service.glow} className="h-full bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-neutral-900">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 transition-colors duration-300 hover:border-primary-400/60 dark:border-neutral-700">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-5`}
                    />

                    {/* Content */}
                    <div className="relative p-6 sm:p-8">
                      {/* Icon */}
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16`}
                      >
                        <service.icon size={24} className="text-white sm:h-7 sm:w-7" />
                      </div>

                      <h3 className="mb-3 text-lg font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:mb-4 sm:text-2xl">
                        {service.title}
                      </h3>

                      <p className="mb-4 leading-relaxed text-sm text-neutral-600 dark:text-neutral-300 sm:mb-6 sm:text-base">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div
                        className={`mb-4 space-y-2 transition-all duration-300 sm:mb-6 ${
                          expandedService === index
                            ? 'max-h-40 opacity-100'
                            : 'max-h-0 overflow-hidden opacity-0'
                        }`}
                      >
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle
                              size={14}
                              className={`mr-2 flex-shrink-0 ${service.textColor}`}
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-300 sm:text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <button
                          onClick={() =>
                            setExpandedService(expandedService === index ? null : index)
                          }
                          className="text-xs font-medium text-primary-600 transition-colors hover:underline dark:text-primary-400 sm:text-sm"
                        >
                          {expandedService === index ? 'Show Less' : "What's Included"}
                        </button>

                        <Link
                          to="/order"
                          className="w-full rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-primary-700 hover:shadow-md sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                        >
                          Get a Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Tilt>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Section — Home already has its own CallToAction section, so skip this banner when limited */}
        {!limit && (
          <Reveal className="mt-16 sm:mt-20">
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
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default PremiumServices;
