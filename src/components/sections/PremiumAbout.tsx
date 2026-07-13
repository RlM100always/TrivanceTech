import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Award, Target, Eye, Heart, TrendingUp, Building, MapPin, ArrowRight } from 'lucide-react';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import SectionHeading from '../ui/motion/SectionHeading';
import Tilt from '../ui/motion/Tilt';

interface PremiumAboutProps {
  /** Renders a condensed teaser (header + mission blurb + link) instead of the full About story, stats, and timeline. Use on Home; the full version lives on /about. */
  compact?: boolean;
}

const PremiumAbout: React.FC<PremiumAboutProps> = ({ compact = false }) => {
  const [counters, setCounters] = useState({ projects: 0, clients: 0, experts: 0, satisfaction: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    { number: 50, label: 'Projects Completed', icon: Award, suffix: '+' },
    { number: 15, label: 'Happy Clients', icon: Users, suffix: '+' },
    { number: 10, label: 'Expert Developers', icon: Building, suffix: '+' },
    { number: 99, label: 'Client Satisfaction', icon: TrendingUp, suffix: '%' }
  ];

  const milestones = [
    { year: '2022', title: 'Company Founded', description: 'Started with a vision to make world-class tech solutions accessible to clients everywhere' },
    { year: '2023', title: 'First Major Client', description: 'Secured partnership with leading financial institution' },
    { year: '2024', title: 'Team Expansion', description: 'Grew to 10+ talented professionals' },
    { year: '2025', title: 'Global Expansion', description: 'Serving clients across 5+ countries' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.01 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentValue = 0;
      const increment = stat.number / steps;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.number) {
          currentValue = stat.number;
          clearInterval(timer);
        }

        setCounters(prev => ({
          ...prev,
          [index === 0 ? 'projects' : index === 1 ? 'clients' : index === 2 ? 'experts' : 'satisfaction']: Math.round(currentValue)
        }));
      }, stepDuration);
    });
  };

  return (
    <section ref={sectionRef} className="overflow-hidden bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Remote-First · Worldwide"
          eyebrowIcon={<MapPin size={16} className="mr-1" />}
          title="About"
          highlight="AiTechWorlds"
          description="We are a remote-first AI & technology solutions company, dedicated to transforming businesses through innovative technology and exceptional service delivery."
        >
          {compact && (
            <Link
              to="/about"
              className="mt-4 inline-flex items-center font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Learn more about us <ArrowRight size={18} className="ml-1" />
            </Link>
          )}
        </SectionHeading>

        {compact ? null : (
          <>
            {/* Video & Story Section */}
            <Reveal direction="up" className="mb-16 sm:mb-20">
              <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
                <div className="group relative order-2 lg:order-1">
                  <Tilt max={6}>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                          <Play size={24} className="ml-1 text-white sm:ml-2" />
                        </button>
                      </div>
                      <img
                        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                        alt="AiTechWorlds Team"
                        className="h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-80"
                      />
                    </div>
                  </Tilt>
                  <div className="absolute -bottom-4 -right-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-500 shadow-xl sm:-bottom-6 sm:-right-6 sm:h-24 sm:w-24">
                    <Award size={24} className="text-white sm:h-8 sm:w-8" />
                  </div>
                </div>

                <div className="order-1 space-y-6 px-4 sm:space-y-8 lg:order-2 lg:px-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg sm:h-12 sm:w-12">
                      <Target size={20} className="text-white sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Our Mission</h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        To empower businesses worldwide with cutting-edge technology solutions that drive growth, efficiency, and innovation in the digital age.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg sm:h-12 sm:w-12">
                      <Eye size={20} className="text-white sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Our Vision</h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        To become a globally trusted and innovative technology solutions provider, setting new standards for excellence in every project we deliver.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 shadow-lg sm:h-12 sm:w-12">
                      <Heart size={20} className="text-white sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Our Values</h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        Innovation, integrity, excellence, and client satisfaction are at the core of everything we do. We believe in building lasting partnerships through trust and quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Stats Section */}
            <StaggerContainer className="mb-16 grid grid-cols-2 gap-6 sm:gap-8 sm:mb-20 lg:grid-cols-4" stagger={0.1}>
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <Tilt max={6}>
                    <div className="group text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-20 sm:w-20">
                        <stat.icon size={24} className="text-white sm:h-8 sm:w-8" />
                      </div>
                      <div className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        {index === 0 ? counters.projects : index === 1 ? counters.clients : index === 2 ? counters.experts : counters.satisfaction}
                        {stat.suffix}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">{stat.label}</div>
                    </div>
                  </Tilt>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Timeline */}
            <Reveal>
              <div className="mb-12 text-center sm:mb-16">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Our Journey</h3>
                <p className="mx-auto max-w-2xl px-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                  Key milestones in our path to becoming a trusted global technology partner
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></div>

                <StaggerContainer className="space-y-8 sm:space-y-12" stagger={0.12}>
                  {milestones.map((milestone, index) => (
                    <StaggerItem key={index}>
                      <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'pr-4 text-right sm:pr-8' : 'pl-4 text-left sm:pl-8'}`}>
                          <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                            <div className="mb-2 text-xl font-bold text-primary-600 dark:text-primary-400 sm:text-2xl">{milestone.year}</div>
                            <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white sm:mb-3 sm:text-xl">{milestone.title}</h4>
                            <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-sm sm:text-base">{milestone.description}</p>
                          </div>
                        </div>

                        <div className="relative z-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg sm:h-12 sm:w-12">
                            <TrendingUp size={16} className="text-white sm:h-5 sm:w-5" />
                          </div>
                        </div>

                        <div className="w-full sm:w-1/2"></div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
};

export default PremiumAbout;
