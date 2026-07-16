import React from 'react';
import { Award, Clock, Users, CheckCircle, Globe, Building, Heart, Zap } from 'lucide-react';
import SectionHeading from '../ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

const WhyChooseUs: React.FC = () => {
  // Mono system — one shared brand hue, neutral card surface. Icons differ by shape.
  const ICON_GRADIENT = 'from-primary-500 to-primary-700';
  const CARD_GLOW = 'rgba(99, 102, 241, 0.18)';

  const features = [
    { icon: Award, title: 'Quality Excellence', description: 'We deliver high-quality projects that exceed expectations and meet all requirements with attention to detail.' },
    { icon: Clock, title: 'On-Time Delivery', description: 'We respect deadlines and ensure your project is delivered on or before the agreed date, every time.' },
    { icon: Users, title: 'Expert Team', description: 'Our team consists of experienced professionals with expertise across various domains and technologies.' },
    { icon: CheckCircle, title: 'Satisfaction Guarantee', description: 'We work until you\'re completely satisfied with the final product and provide ongoing support.' },
    { icon: Globe, title: 'Global Standards', description: 'International best practices and cutting-edge technologies implemented in every project we deliver.' },
    { icon: Building, title: 'Local Expertise', description: 'Hands-on experience across web, mobile, AI, and academic domains, honed on real client projects.' },
    { icon: Heart, title: '24/7 Support', description: 'Round-the-clock customer support and maintenance services to ensure your systems run smoothly.' },
    { icon: Zap, title: 'Innovation Focus', description: 'We stay ahead of technology trends and implement innovative solutions that give you competitive advantage.' },
  ];

  return (
    <section className="bg-neutral-50 py-16 dark:bg-neutral-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          eyebrowIcon={<Award size={16} className="mr-1" />}
          title="Why"
          highlight="AiTechWorlds?"
          description="We stand out from the competition with our commitment to quality, timeliness, and customer satisfaction."
        />

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4" stagger={0.06}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Tilt max={8} className="h-full">
                <SpotlightCard glowColor={CARD_GLOW} className="h-full rounded-2xl bg-white dark:bg-neutral-800/60">
                  <div className="flex h-full flex-col items-center p-6 text-center">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${ICON_GRADIENT} shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-20 sm:w-20`}>
                      <feature.icon size={28} className="text-white sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:mb-4 sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base text-sm">
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              </Tilt>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default WhyChooseUs;
