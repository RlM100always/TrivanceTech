import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MessageSquare } from 'lucide-react';

const CallToAction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 dark:from-primary-800 dark:via-primary-900 dark:to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 sm:mb-6">
              <MessageSquare size={16} className="mr-2" />
              Ready to Get Started?
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Transform Your Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">Reality</span>
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200 leading-relaxed">
              Join hundreds of satisfied clients who have chosen Trivance Tech for their digital transformation journey. Let's build something amazing together.
            </p>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center justify-center lg:justify-start">
                <Mail size={20} className="mr-3 text-accent-400" />
                <div>
                  <p className="text-sm text-gray-300">Email Us</p>
                  <p className="font-semibold">info@trivancetech.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <Phone size={20} className="mr-3 text-accent-400" />
                <div>
                  <p className="text-sm text-gray-300">Call Us</p>
                  <p className="font-semibold">+880 1700-000000</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Your Project
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Get Free Consultation
              </Link>
            </div>
          </div>

          {/* Image/Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="aspect-video bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1" 
                alt="Team collaboration" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Projects Done</div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-accent-500 rounded-xl p-4 shadow-xl">
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;