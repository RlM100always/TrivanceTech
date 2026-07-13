import React from 'react';
import { Award, Clock, Users, CheckCircle, Globe, Building, Heart, Zap } from 'lucide-react';
import SectionHeading from '../ui/motion/SectionHeading';
import { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import Tilt from '../ui/motion/Tilt';
import SpotlightCard from '../ui/motion/SpotlightCard';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We deliver high-quality projects that exceed expectations and meet all requirements with attention to detail.',
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      glow: 'rgba(234, 179, 8, 0.18)',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'We respect deadlines and ensure your project is delivered on or before the agreed date, every time.',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      glow: 'rgba(59, 130, 246, 0.18)',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team consists of experienced professionals with expertise across various domains and technologies.',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      glow: 'rgba(34, 197, 94, 0.18)',
    },
    {
      icon: CheckCircle,
      title: 'Satisfaction Guarantee',
      description: 'We work until you\'re completely satisfied with the final product and provide ongoing support.',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      glow: 'rgba(168, 85, 247, 0.18)',
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'International best practices and cutting-edge technologies implemented in every project we deliver.',
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      glow: 'rgba(99, 102, 241, 0.18)',
    },
    {
      icon: Building,
      title: 'Local Expertise',
      description: 'Hands-on experience across web, mobile, AI, and academic domains, honed on real client projects.',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      glow: 'rgba(239, 68, 68, 0.18)',
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Round-the-clock customer support and maintenance services to ensure your systems run smoothly.',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      glow: 'rgba(236, 72, 153, 0.18)',
    },
    {
      icon: Zap,
      title: 'Innovation Focus',
      description: 'We stay ahead of technology trends and implement innovative solutions that give you competitive advantage.',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      glow: 'rgba(249, 115, 22, 0.18)',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-800 sm:py-20">
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
                <SpotlightCard glowColor={feature.glow} className="h-full rounded-2xl">
                  <div className={`flex h-full flex-col items-center p-6 text-center ${feature.bgColor}`}>
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-20 sm:w-20`}>
                      <feature.icon size={28} className="text-white sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:mb-4 sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base text-sm">
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
