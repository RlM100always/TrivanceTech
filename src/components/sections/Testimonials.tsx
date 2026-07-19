import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal, { StaggerContainer, StaggerItem } from '../ui/motion/Reveal';
import { EASE_OUT } from '../../lib/motion';

interface TestimonialsProps {
  /** Home shows one bold featured quote instead of the 3-up grid; the full grid lives on /testimonials. */
  featured?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ featured = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'CEO, Fashion Boutique',
      company: 'Fashion Boutique',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      text: 'Outstanding service! The team delivered our e-commerce platform ahead of schedule and exceeded all expectations. The attention to detail and professional approach was impressive.',
      project: 'E-commerce Platform'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Founder, Tech Startup',
      company: 'Tech Startup',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'Professional team with excellent communication. They helped us create a mobile app that our customers love. Great attention to detail and innovative solutions!',
      project: 'Mobile Application'
    },
    {
      id: '3',
      name: 'Dr. Emily Brown',
      position: 'Research Director',
      company: 'University Research',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      text: 'The academic research project was thoroughly done and well-documented. The team\'s expertise in the subject matter was impressive and the delivery was on time.',
      project: 'Research Project'
    },
    {
      id: '4',
      name: 'Ahmed Hassan',
      position: 'Business Owner',
      company: 'Local Business',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 5,
      text: 'AiTechWorlds transformed our business with their digital solutions. The website they built has increased our online presence significantly. Highly recommended!',
      project: 'Business Website'
    },
    {
      id: '5',
      name: 'Jennifer Lee',
      position: 'Marketing Manager',
      company: 'Digital Agency',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      text: 'Working with AiTechWorlds was a pleasure. They understood our requirements perfectly and delivered a solution that exceeded our expectations.',
      project: 'Digital Platform'
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentSlide],
    testimonials[(currentSlide + 1) % testimonials.length],
    testimonials[(currentSlide + 2) % testimonials.length]
  ];

  return (
    <section className="py-16 sm:py-20 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center mb-12 sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            <MessageSquare size={14} />
            Client Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-neutral-900 dark:text-white">
            We'd rather they <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-300 dark:to-primary-500">sell it than us.</span>
          </h2>
        </Reveal>

        {/* Testimonials Slider */}
        <Reveal delay={0.1} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative">
          {featured ? (
            /* Home: one bold, horizontal featured quote (copy left, person right) */
            <div className="mx-auto mb-10 max-w-5xl">
              <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-xl dark:border-white/10 dark:bg-neutral-800/60 sm:p-12">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.6fr_1fr]"
                  >
                    {/* Quote */}
                    <div>
                      <Quote size={44} className="mb-5 fill-current text-primary-500/40" />
                      <p className="text-xl font-semibold leading-relaxed text-neutral-800 dark:text-neutral-100 sm:text-2xl">
                        {testimonials[currentSlide].text}
                      </p>
                      <div className="mt-6 flex">
                        {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                          <Star key={i} size={18} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Person */}
                    <div className="flex items-center gap-4 border-t border-neutral-200 pt-6 dark:border-white/10 lg:flex-col lg:items-start lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                      <img
                        src={testimonials[currentSlide].image}
                        alt={testimonials[currentSlide].name}
                        loading="lazy"
                        className="h-16 w-16 flex-shrink-0 rounded-full object-cover shadow-md lg:h-20 lg:w-20"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{testimonials[currentSlide].name}</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonials[currentSlide].position.split(',')[0]}</p>
                        <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">{testimonials[currentSlide].company}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8" stagger={0.1}>
              {visibleTestimonials.map((testimonial, index) => (
                <StaggerItem key={testimonial.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className={`bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-neutral-100 dark:border-neutral-700 ${
                      index === 0 ? 'md:scale-105 md:shadow-2xl' : ''
                    }`}
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-300 italic mb-6 leading-relaxed text-sm sm:text-base">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center">
                      <div
                        aria-hidden
                        className="w-12 h-12 rounded-full mr-4 flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/20"
                      >
                        {testimonial.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.position}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{testimonial.project}</p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              aria-label="Previous testimonial"
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              aria-label="Next testimonial"
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.2} className="text-center mt-12">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: EASE_OUT }} className="inline-block">
            <Link
              to="/testimonials"
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All Testimonials
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;