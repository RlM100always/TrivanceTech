import React, { useState, useEffect, useRef } from 'react';
import { Award, Clock, Users, CheckCircle, Globe, Building, Heart, Zap } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We deliver high-quality projects that exceed expectations and meet all requirements with attention to detail.',
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'We respect deadlines and ensure your project is delivered on or before the agreed date, every time.',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team consists of experienced professionals with expertise across various domains and technologies.',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: CheckCircle,
      title: 'Satisfaction Guarantee',
      description: 'We work until you\'re completely satisfied with the final product and provide ongoing support.',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'International best practices and cutting-edge technologies implemented in every project we deliver.',
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      icon: Building,
      title: 'Local Expertise',
      description: 'Deep understanding of Bangladesh\'s business landscape and regulatory environment for better solutions.',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Round-the-clock customer support and maintenance services to ensure your systems run smoothly.',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: Zap,
      title: 'Innovation Focus',
      description: 'We stay ahead of technology trends and implement innovative solutions that give you competitive advantage.',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
            <Award size={16} className="mr-2" />
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Trivance Tech</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We stand out from the competition with our commitment to quality, timeliness, and customer satisfaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group text-center p-6 sm:p-8 rounded-2xl ${feature.bgColor} hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-primary-200 dark:hover:border-primary-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon size={28} className="text-white sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;