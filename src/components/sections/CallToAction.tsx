import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Clock, Globe2, MessageCircle } from 'lucide-react';
import { CONTACT_EMAIL, whatsappChatLink } from '../../utils/socialLinks';
import Reveal from '../ui/motion/Reveal';
import MagneticButton from '../ui/motion/MagneticButton';

const contactRows = [
  { icon: Mail, label: 'Email us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: MessageCircle, label: 'Chat with us', value: 'WhatsApp / Telegram', href: whatsappChatLink("Hi AiTechWorlds! I'd like to start a project.") },
  { icon: Clock, label: 'Response time', value: 'Usually within a few hours' },
  { icon: Globe2, label: 'Where we work', value: 'Remote-first, worldwide' },
];

const CallToAction: React.FC = () => {
  return (
    <section className="bg-neutral-50/70 py-16 backdrop-blur-xl dark:bg-neutral-950/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-neutral-900 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm lg:mx-0">
                <Rocket size={26} />
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
                Your idea deserves a senior team.
              </h2>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                Let's build something remarkable — together. Tell us what you want to build and
                you'll get a straight answer on scope, timeline and cost.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <MagneticButton strength={0.4} className="w-full sm:w-auto">
                  <Link
                    to="/order"
                    className="flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-100 sm:px-8 sm:py-4"
                  >
                    Start your project
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.4} className="w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:px-8 sm:py-4"
                  >
                    Book a consultation
                  </Link>
                </MagneticButton>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 gap-5 border-t border-white/10 pt-8 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {contactRows.map((row) => {
                const content = (
                  <>
                    <row.icon size={18} className="mt-0.5 flex-shrink-0 text-primary-300" />
                    <div>
                      <p className="text-xs text-neutral-400">{row.label}</p>
                      <p className="text-sm font-semibold">{row.value}</p>
                    </div>
                  </>
                );
                return row.href ? (
                  <a
                    key={row.label}
                    href={row.href}
                    target={row.href.startsWith('http') ? '_blank' : undefined}
                    rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-3 transition-opacity hover:opacity-80"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={row.label} className="flex items-start gap-3">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CallToAction;
