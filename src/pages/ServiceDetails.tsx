import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Sparkles, MessageCircle,
  Clock, Tag, HelpCircle, Layers, Workflow, Target,
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import { SITE_URL } from '../components/seo/SEO';
import { servicesData, getServiceBySlug } from '../data/services';

const ServiceDetails: React.FC = () => {
  const { slug } = useParams();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const [imgError, setImgError] = React.useState(false);

  if (!service) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center py-16">
          <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={48} className="text-neutral-400" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Service Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">The service you're looking for doesn't exist or has been moved.</p>
          <Link to="/services" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300">
            <ArrowLeft className="mr-2" size={20} />
            Back to All Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const related = servicesData.filter((s) => s.id !== service.id).slice(0, 3);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'AiTechWorlds',
      url: SITE_URL,
    },
    areaServed: 'Worldwide',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: service.pricing.replace(/[^0-9.]/g, ''),
      description: service.pricing,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 2, name: service.title, item: `${SITE_URL}/services/${service.id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <SEO
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.id}`}
        image={service.image}
        keywords={service.keywords}
        jsonLd={[serviceSchema, faqSchema, breadcrumbSchema]}
      />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${service.color}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link to="/services" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="mr-1.5" size={18} />
            All Services
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-4">
                <Icon size={16} className="mr-2" />
                {service.title}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 leading-relaxed">
                {service.tagline}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-sm text-white">
                  <Tag size={15} className="mr-1.5" /> {service.pricing}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-sm text-white">
                  <Clock size={15} className="mr-1.5" /> {service.deliveryTime}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/order" className="inline-flex items-center justify-center px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Start Your Project
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/25">
                  Ask a Question
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20">
                {!imgError ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="eager"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/10">
                    <Icon size={64} className="text-white/60" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Overview</h2>
              <div className="space-y-4">
                {service.overview.map((para, i) => (
                  <p key={i} className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={22} className={service.textColor} />
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Why It's Worth It</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.benefits.map((b, i) => (
                  <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <h3 className={`font-bold text-lg mb-1.5 ${service.textColor}`}>{b.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What's included / features */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Layers size={22} className={service.textColor} />
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">What's Included</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((f, i) => (
                  <div key={i} className="flex items-start p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700">
                    <CheckCircle size={18} className={`mr-2.5 mt-0.5 ${service.textColor} flex-shrink-0`} />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Workflow size={22} className={service.textColor} />
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">How We Deliver</h2>
              </div>
              <div className="space-y-4">
                {service.process.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${service.color} text-white font-bold flex items-center justify-center`}>
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-0.5">{step.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Use cases */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Target size={22} className={service.textColor} />
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Perfect For</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.useCases.map((u, i) => (
                  <li key={i} className="flex items-start">
                    <ArrowRight size={18} className={`mr-2 mt-0.5 ${service.textColor} flex-shrink-0`} />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{u}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle size={22} className={service.textColor} />
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {service.faqs.map((f, i) => (
                  <details key={i} className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                    <summary className="cursor-pointer list-none flex items-center justify-between p-4 font-semibold text-neutral-900 dark:text-white">
                      {f.q}
                      <span className={`ml-3 transition-transform group-open:rotate-45 ${service.textColor} text-xl leading-none`}>+</span>
                    </summary>
                    <p className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quote card */}
              <div className={`rounded-2xl p-6 bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
                <p className="text-white/90 text-sm mb-5">Tell us what you need and get a clear, fixed quote — no obligation, no jargon.</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Starting price</span>
                    <span className="font-bold">{service.pricing}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Delivery</span>
                    <span className="font-bold">{service.deliveryTime}</span>
                  </div>
                </div>
                <Link to="/order" className="block text-center px-5 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors mb-3">
                  Start Your Project
                </Link>
                <Link to="/contact" className="flex items-center justify-center px-5 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/25">
                  <MessageCircle size={16} className="mr-1.5" />
                  Ask a Question
                </Link>
              </div>

              {/* Deliverables */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">What You Get</h3>
                <ul className="space-y-2.5">
                  {service.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle size={16} className={`mr-2 mt-0.5 ${service.textColor} flex-shrink-0`} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related services */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">Explore More Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {related.map((r) => {
              const RIcon = r.icon;
              return (
                <Link key={r.id} to={`/services/${r.id}`} className="group bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${r.bgColor} mb-3`}>
                    <RIcon size={20} className={r.textColor} />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{r.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{r.tagline}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Let's Build Something That Grows Your Business</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join clients worldwide who trust AiTechWorlds to deliver {service.title.toLowerCase()} that actually moves the needle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Project
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
              Talk to Us First
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
