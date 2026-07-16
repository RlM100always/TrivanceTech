import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Linkedin, Facebook, Youtube, Send, ArrowRight, MessageCircle, X as XIcon } from 'lucide-react';
import Logo from '../ui/Logo';
import { SOCIAL_LINKS, CONTACT_EMAIL, whatsappChatLink } from '../../utils/socialLinks';

const PremiumFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-neutral-800 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className="text-neutral-400">
                  Get the latest AI &amp; tech news, project offers, and job opportunities delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-neutral-400"
                />
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center">
                  Subscribe
                  <Send size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Logo variant="light" size="md" className="mb-6" />
              <p className="text-neutral-400 mb-6 leading-relaxed">
                AI, tech &amp; software solutions for the world — web, mobile, AI/ML, and academic project support, delivered remotely to clients everywhere.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on LinkedIn"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on Facebook"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on X (Twitter)"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <XIcon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on Instagram"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on YouTube"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <Youtube size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AiTechWorlds on Telegram"
                  className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 group"
                >
                  <Send size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Pinterest
                </a>
                <a href={SOCIAL_LINKS.quora} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Quora
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
                <Link to="/projects" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Portfolio
                </Link>
                <Link to="/careers" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Careers
                </Link>
                <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </nav>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Web Development
                </Link>
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Mobile Apps
                </Link>
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  AI &amp; Machine Learning
                </Link>
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cybersecurity
                </Link>
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Academic Projects &amp; Thesis
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center group">
                  <Mail className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Remote-first — serving clients worldwide. Fastest reply via Telegram or WhatsApp.
                </p>
              </div>

              {/* Quick contact buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={whatsappChatLink("Hi AiTechWorlds! I'd like to start a project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  <Send size={18} />
                  Message on Telegram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 dark:border-neutral-700 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-neutral-400 text-sm mb-4 md:mb-0">
                &copy; {currentYear} AiTechWorlds. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
