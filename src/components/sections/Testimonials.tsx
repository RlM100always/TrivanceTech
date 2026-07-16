import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestimonialsProps {
  /** Home shows one bold featured quote instead of the 3-up grid; the full grid lives on /testimonials. */
  featured?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ featured = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
            <MessageSquare size={16} className="mr-2" />
            Client Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Clients Say</span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {featured ? (
            /* Home: one bold, large featured quote */
            <div className="mx-auto mb-10 max-w-4xl">
              <div className="relative rounded-3xl border border-neutral-100 bg-white p-8 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 sm:p-12">
                <Quote size={56} className="absolute -top-5 left-8 text-primary-500/30" />
                <div className="mb-5 flex justify-center">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} size={22} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-center text-xl font-medium leading-relaxed text-neutral-800 dark:text-neutral-100 sm:text-2xl">
                  "{testimonials[currentSlide].text}"
                </p>
                <div className="mt-8 flex items-center justify-center">
                  <div
                    aria-hidden
                    className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-base font-semibold text-white shadow-md shadow-primary-500/20"
                  >
                    {testimonials[currentSlide].name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">{testimonials[currentSlide].name}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonials[currentSlide].position}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              {visibleTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-neutral-100 dark:border-neutral-700 transform hover:-translate-y-2 ${
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
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            to="/testimonials" 
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;