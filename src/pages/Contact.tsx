import { Mail, Send, MessageCircle, Linkedin, Globe } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, CONTACT_EMAIL, whatsappChatLink } from '../utils/socialLinks';
import SEO from '../components/seo/SEO';
import TurnstileWidget from '../components/ui/Turnstile';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import ActionButton from '../components/ui/layout/ActionButton';

const TURNSTILE_ENABLED = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

interface ContactFormInputs {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

/** Shared field styling — matches the glass inputs on /projects and /blog. */
const INPUT_BASE =
  'w-full rounded-xl border bg-white/80 px-4 py-3 text-neutral-900 placeholder-neutral-500 backdrop-blur transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-white/5 dark:text-white dark:placeholder-neutral-400';
const INPUT_IDLE = 'border-neutral-300 dark:border-white/10';
const INPUT_ERROR = 'border-red-500 dark:border-red-500';

const fieldClass = (hasError: boolean) =>
  `${INPUT_BASE} ${hasError ? INPUT_ERROR : INPUT_IDLE}`;

const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300';
const ERROR_CLASS = 'mt-1.5 text-sm text-red-600 dark:text-red-400';

/** Soft tinted icon tile — the same treatment used across the home sections. */
const ICON_TILE =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400';

const LINK_CLASS =
  'text-neutral-600 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>();

  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          subject: data.subject,
          message: data.message,
          source: 'contact',
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error || 'Failed to send your message.');
      }
      setSubmitted(true);
      reset();
      setTurnstileToken('');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <PageShell>
      <SEO
        title="Contact Us — Get In Touch"
        description="Have a quick question? Reach AiTechWorlds via email, WhatsApp, Telegram, or LinkedIn — remote-first, replying to clients worldwide."
        path="/contact"
        keywords={['contact AiTechWorlds', 'hire a developer', 'software company contact']}
      />

      <PageHero
        eyebrow="Quick Inquiry"
        eyebrowIcon={<Mail size={13} />}
        title="Have a question?"
        highlight="a question?"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        description={
          <>
            Reach out for general questions, quick quotes, or anything else. Ready to kick off a full project?{' '}
            <Link
              to="/order"
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              Submit a project order →
            </Link>
          </>
        }
      />

      <Section tone="plain">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Contact details */}
          <GlassCard interactive={false} className="lg:col-span-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
              Contact information
            </h2>

            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className={ICON_TILE}>
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Email</h3>
                  <p className="mt-0.5 break-words">
                    <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={ICON_TILE}>
                  <MessageCircle size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">WhatsApp / Telegram</h3>
                  <p className="mt-0.5 flex flex-col gap-0.5">
                    <a
                      href={whatsappChatLink('Hi AiTechWorlds! I have a quick question.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      Chat on WhatsApp
                    </a>
                    <a
                      href={SOCIAL_LINKS.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      Message on Telegram
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={ICON_TILE}>
                  <Linkedin size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">LinkedIn</h3>
                  <p className="mt-0.5 break-words">
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      linkedin.com/company/aitechworlds
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={ICON_TILE}>
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Availability</h3>
                  <p className="mt-0.5 text-neutral-600 dark:text-neutral-400">
                    Remote-first — serving clients worldwide
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200/70 pt-6 dark:border-white/10">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Response time</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                We typically reply within 24 hours by email, and even faster via Telegram or WhatsApp.
              </p>
            </div>
          </GlassCard>

          {/* Form */}
          <GlassCard interactive={false} className="lg:col-span-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
              Send us a message
            </h2>

            <div aria-live="polite" role="status">
              {submitted && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-700 backdrop-blur dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                  Thanks! Your message has been sent — we'll get back to you within 24 hours.
                </div>
              )}
              {submitError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {submitError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={fieldClass(Boolean(errors.name))}
                    placeholder="Your full name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className={ERROR_CLASS}>{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={fieldClass(Boolean(errors.email))}
                    placeholder="your.email@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && <p className={ERROR_CLASS}>{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                    <MessageCircle size={14} className="text-green-500" />
                    WhatsApp Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={fieldClass(Boolean(errors.phone))}
                    placeholder="+8801XXXXXXXXX (with country code)"
                    {...register('phone', {
                      required: 'WhatsApp number is required',
                      pattern: {
                        value: /^[+]?[\d\s-]{7,}$/,
                        message: 'Enter a valid WhatsApp number with country code',
                      },
                    })}
                  />
                  {errors.phone ? (
                    <p className={ERROR_CLASS}>{errors.phone.message}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      We reply fastest on WhatsApp — include your country code.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className={LABEL_CLASS}>
                    Company/Institution
                  </label>
                  <input
                    id="company"
                    type="text"
                    className={fieldClass(false)}
                    placeholder="Your company or institution"
                    {...register('company')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={LABEL_CLASS}>
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  className={fieldClass(Boolean(errors.subject))}
                  placeholder="What is your message about?"
                  {...register('subject', { required: 'Subject is required' })}
                />
                {errors.subject && <p className={ERROR_CLASS}>{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className={LABEL_CLASS}>
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={fieldClass(Boolean(errors.message))}
                  placeholder="What's your question? We'll get back to you shortly..."
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 20,
                      message: 'Message must be at least 20 characters',
                    },
                  })}
                />
                {errors.message && <p className={ERROR_CLASS}>{errors.message.message}</p>}
              </div>

              <TurnstileWidget onVerify={setTurnstileToken} />

              <ActionButton
                type="submit"
                size="lg"
                disabled={isSubmitting || (TURNSTILE_ENABLED && !turnstileToken)}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </ActionButton>
            </form>
          </GlassCard>
        </div>
      </Section>

      {/* Remote-first note */}
      <Section tone="accent" compact>
        <div className="mx-auto max-w-2xl text-center">
          <div className={`${ICON_TILE} mx-auto`}>
            <Globe size={20} />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Remote-first, worldwide
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
            AiTechWorlds works with clients across the globe. No office visit needed — everything from consultation
            to delivery happens online via email, Telegram, or WhatsApp.
          </p>
        </div>
      </Section>
    </PageShell>
  );
};

export default Contact;
