import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, MessageSquare } from 'lucide-react';
import { CONTACT_EMAIL } from '../../utils/socialLinks';
import Reveal from '../ui/motion/Reveal';
import MagneticButton from '../ui/motion/MagneticButton';

const CallToAction: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 py-16 text-white dark:from-primary-800 dark:via-primary-900 dark:to-gray-900 sm:py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="aurora-blob absolute -left-24 top-0 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="aurora-blob absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Content */}
          <Reveal direction="left" className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur-sm sm:mb-6">
              <MessageSquare size={16} className="mr-1" />
              Ready to Get Started?
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl md:text-5xl">
              Transform Your Ideas into{' '}
              <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Reality
              </span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-200 sm:mb-8 sm:text-xl">
              Join hundreds of satisfied clients who have chosen AiTechWorlds for their digital transformation journey. Let's build something amazing together.
            </p>

            {/* Contact Info */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-center lg:justify-start">
                <Mail size={20} className="mr-3 text-accent-400" />
                <div>
                  <p className="text-sm text-gray-300">Email Us</p>
                  <p className="font-semibold">{CONTACT_EMAIL}</p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <MessageCircle size={20} className="mr-3 text-accent-400" />
                <div>
                  <p className="text-sm text-gray-300">Chat With Us</p>
                  <p className="font-semibold">WhatsApp / Telegram</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <MagneticButton strength={0.4} className="w-full sm:w-auto">
                <Link
                  to="/order"
                  className="flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:px-8 sm:py-4"
                >
                  Start Your Project
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.4} className="w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:px-8 sm:py-4"
                >
                  Get Free Consultation
                </Link>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Image/Visual */}
          <Reveal direction="right" className="relative">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                alt="Team collaboration"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white p-4 shadow-xl dark:bg-gray-800">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Projects Done</div>
            </div>

            <div className="absolute -right-4 -top-4 rounded-xl bg-accent-500 p-4 shadow-xl">
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
