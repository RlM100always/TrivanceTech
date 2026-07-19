import React from 'react';
import { Globe, Zap, CheckCircle, ArrowRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { servicesData } from '../data/services';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';
import Reveal from '../components/ui/motion/Reveal';

const Services: React.FC = () => {
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  const handleImageError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };
  const services = servicesData;

  return (
    <PageShell>
      <SEO
        title="Our Services — Web, Mobile, AI, Content, Branding, Marketing & Custom Software"
        description="Explore AiTechWorlds' services: content writing, blog posts, content strategy, website copy, scriptwriting, creative writing, podcast & speech writing, research, AI image & poster/book design, personal branding, digital marketing, programming, custom software, prompt engineering, vibe coding, bug fixing, SEO/AEO/GEO, and Google & Meta Business — delivered remotely worldwide."
        path="/services"
        keywords={['content writing services', 'blog writing', 'AI image generation', 'scriptwriting', 'digital marketing', 'prompt engineering', 'custom software development', 'personal branding website', 'SEO AEO GEO services', 'bug fixing and deployment']}
      />

      <PageHero
        eyebrow="Our Services"
        eyebrowIcon={<Zap size={13} />}
        title="Whatever you're building, we can ship it"
        highlight="we can ship it"
        description="Seven disciplines, one accountable team — so you're never stuck explaining your product to a new vendor halfway through."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      {/* Alternating service blocks, each on its own banded row */}
      {services.map((service, index) => (
        <Section key={service.id} tone={index % 2 === 1 ? 'muted' : 'plain'} compact>
          <div
            className={`grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12 ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}
          >
            {/* Copy */}
            <Reveal direction="up" className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${service.bgColor} ${service.textColor}`}
              >
                <service.icon size={14} />
                {service.title}
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                <Link
                  to={`/services/${service.id}`}
                  className="transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {service.title}
                </Link>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
                {service.description}
              </p>

              {/* Features */}
              <ul className="mt-6 space-y-2.5">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle size={18} className={`mr-3 mt-0.5 flex-shrink-0 ${service.textColor}`} />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                  Technologies we use
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & timeline */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <GlassCard interactive={false} className="p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Starting price
                  </h3>
                  <p className={`mt-1 text-lg font-bold ${service.textColor}`}>{service.pricing}</p>
                </GlassCard>
                <GlassCard interactive={false} className="p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Delivery time
                  </h3>
                  <p className={`mt-1 text-lg font-bold ${service.textColor}`}>{service.deliveryTime}</p>
                </GlassCard>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ActionButton to={`/services/${service.id}`} variant="primary">
                  Explore {service.title}
                  <ArrowRight size={18} />
                </ActionButton>
                <ActionButton to="/order" variant="ghost">
                  Get a Free Quote
                </ActionButton>
              </div>
            </Reveal>

            {/* Visual */}
            <Reveal
              direction="up"
              delay={0.1}
              className={index % 2 === 1 ? 'lg:col-start-1' : ''}
            >
              <Link to={`/services/${service.id}`} className="group block lg:sticky lg:top-24">
                <GlassCard flush className="aspect-video">
                  <div
                    className={`absolute inset-0 z-10 bg-gradient-to-br ${service.color} opacity-20 transition-opacity duration-300 group-hover:opacity-30`}
                  />
                  {!imageErrors.has(service.id) ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      onError={() => handleImageError(service.id)}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-500">
                      <ImageOff size={32} />
                      <p className="text-sm">Image unavailable</p>
                    </div>
                  )}
                </GlassCard>
              </Link>
            </Reveal>
          </div>
        </Section>
      ))}

      {/* Closing CTA */}
      <Section tone="plain">
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-14 text-center text-white shadow-2xl shadow-primary-900/20 sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <Globe size={40} className="mx-auto mb-5 opacity-80" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Still comparing options?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
                Send us your requirements and we'll send back a real quote, not a sales call — usually
                within 24 hours.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ActionButton
                  to="/order"
                  size="lg"
                  className="bg-white text-primary-700 shadow-lg hover:bg-neutral-100"
                >
                  Start Your Project
                  <ArrowRight size={18} />
                </ActionButton>
                <ActionButton
                  to="/projects"
                  size="lg"
                  className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                >
                  View Our Work
                </ActionButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
};

export default Services;
