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

  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with cutting-edge technologies',
      features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimization', 'Performance Focused'],
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-blue-600 dark:text-blue-400',
      glow: 'rgba(59, 130, 246, 0.18)',
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      features: ['Native iOS & Android', 'Cross-platform Solutions', 'UI/UX Excellence', 'App Store Optimization'],
      color: 'from-purple-500 to-purple-700',
      textColor: 'text-purple-600 dark:text-purple-400',
      glow: 'rgba(168, 85, 247, 0.18)',
    },
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by artificial intelligence',
      features: ['Custom AI Models', 'Data Analytics', 'Automation', 'Predictive Analysis'],
      color: 'from-orange-500 to-orange-700',
      textColor: 'text-orange-600 dark:text-orange-400',
      glow: 'rgba(249, 115, 22, 0.18)',
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions and vulnerability assessments',
      features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Risk Assessment'],
      color: 'from-red-500 to-red-700',
      textColor: 'text-red-600 dark:text-red-400',
      glow: 'rgba(239, 68, 68, 0.18)',
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design, optimization, and management',
      features: ['Database Design', 'Performance Tuning', 'Data Migration', 'Backup Solutions'],
      color: 'from-indigo-500 to-indigo-700',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      glow: 'rgba(99, 102, 241, 0.18)',
    },
    {
      icon: GraduationCap,
      title: 'Academic Projects & Thesis',
      description: 'Professional assistance for university students with projects, thesis, and assignments',
      features: ['Research Projects', 'Thesis Writing', 'Assignment Help', 'Academic Consultation'],
      color: 'from-teal-500 to-teal-700',
      textColor: 'text-teal-600 dark:text-teal-400',
      glow: 'rgba(20, 184, 166, 0.18)',
    },
    {
      icon: Palette,
      title: 'UI & UX Design',
      description: 'Beautiful and intuitive user interfaces that deliver exceptional user experiences',
      features: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Design Systems'],
      color: 'from-pink-500 to-pink-700',
      textColor: 'text-pink-600 dark:text-pink-400',
      glow: 'rgba(236, 72, 153, 0.18)',
    },
  ];

  const visibleServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="overflow-hidden bg-gray-50 py-16 dark:bg-gray-800 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Expertise"
          eyebrowIcon={<Zap size={16} className="mr-1" />}
          title="Comprehensive IT Solutions"
          highlight="IT Solutions"
          description="From web development to AI solutions, we deliver cutting-edge technology services that drive business growth and innovation."
        >
          {limit && (
            <Link
              to="/services"
              className="mt-4 inline-flex items-center font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all services <ChevronRight size={18} className="ml-1" />
            </Link>
          )}
        </SectionHeading>

        {/* Services Grid */}
        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.07}>
          {visibleServices.map((service, index) => (
            <StaggerItem key={index}>
              <Tilt max={8} className="h-full">
                <SpotlightCard glowColor={service.glow} className="h-full bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-gray-900">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 transition-colors duration-300 hover:border-blue-400/60 dark:border-gray-700">
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

                      <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:mb-4 sm:text-2xl">
                        {service.title}
                      </h3>

                      <p className="mb-4 leading-relaxed text-sm text-gray-600 dark:text-gray-300 sm:mb-6 sm:text-base">
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
                            <span className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
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
                          {expandedService === index ? 'Show Less' : 'Learn More'}
                        </button>

                        <Link
                          to="/order"
                          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-md sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                        >
                          Get Started
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white md:p-12 sm:p-8">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 text-center">
                <h3 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Ready to Transform Your Business?</h3>
                <p className="mb-6 max-w-2xl px-4 text-lg opacity-90 sm:mb-8 sm:text-xl">
                  Join hundreds of satisfied clients who have chosen AiTechWorlds for their digital transformation journey.
                </p>
                <div className="flex flex-col justify-center gap-4 px-4 sm:flex-row">
                  <Link
                    to="/order"
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:px-8 sm:py-4"
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
