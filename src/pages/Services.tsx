import React from 'react';
import { Globe, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { servicesData } from '../data/services';

const Services: React.FC = () => {
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };
  const services = servicesData;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 sm:py-20">
      <SEO
        title="Our Services — Web, Mobile, AI, Content, Branding, Marketing & Custom Software"
        description="Explore AiTechWorlds' services: content writing, blog posts, content strategy, website copy, scriptwriting, creative writing, podcast & speech writing, research, AI image & poster/book design, personal branding, digital marketing, programming, custom software, prompt engineering, vibe coding, bug fixing, SEO/AEO/GEO, and Google & Meta Business — delivered remotely worldwide."
        path="/services"
        keywords={['content writing services', 'blog writing', 'AI image generation', 'scriptwriting', 'digital marketing', 'prompt engineering', 'custom software development', 'personal branding website', 'SEO AEO GEO services', 'bug fixing and deployment']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
            <Zap size={16} className="mr-2" />
            Our Services
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">IT Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            From web development to AI solutions, we deliver cutting-edge technology services that drive business growth and innovation for clients worldwide.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-12 sm:space-y-16">
          {services.map((service, index) => (
            <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:items-start ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 ${service.bgColor} rounded-full text-sm font-medium ${service.textColor} mb-4`}>
                  <service.icon size={16} className="mr-2" />
                  {service.title}
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
                  <Link to={`/services/${service.id}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    {service.title}
                  </Link>
                </h2>
                
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckCircle size={18} className={`mr-3 mt-0.5 ${service.textColor} flex-shrink-0`} />
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Technologies We Use:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                  <div className={`p-3 sm:p-4 ${service.bgColor} rounded-lg`}>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Starting Price</h4>
                    <p className={`text-base sm:text-lg font-bold ${service.textColor}`}>{service.pricing}</p>
                  </div>
                  <div className={`p-3 sm:p-4 ${service.bgColor} rounded-lg`}>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Delivery Time</h4>
                    <p className={`text-base sm:text-lg font-bold ${service.textColor}`}>{service.deliveryTime}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Explore {service.title}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  <Link
                    to="/order"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <Link to={`/services/${service.id}`} className="block relative group lg:sticky lg:top-24">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="relative z-10 aspect-video overflow-hidden rounded-lg">
                    {!imageErrors.has(service.id) ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        loading="lazy"
                        onError={() => handleImageError(service.id)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                        <div className="text-center p-4">
                          <svg className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Image unavailable</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play size={20} className="text-white ml-1 sm:w-6 sm:h-6" />
                    </button>
                  </div> */}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center">
          <Globe size={32} className="mx-auto mb-4 sm:mb-6 opacity-80 sm:w-12 sm:h-12" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Transform Your Business?</h3>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have chosen AiTechWorlds for their digital transformation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Project
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;