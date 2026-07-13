import { Mail, Send, MessageCircle, Linkedin, Globe } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, CONTACT_EMAIL, whatsappChatLink } from '../utils/socialLinks';
import SEO from '../components/seo/SEO';

interface ContactFormInputs {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormInputs>();

  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error || 'Failed to send your message.');
      }
      setSubmitted(true);
      reset();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
      <SEO
        title="Contact Us — Get In Touch"
        description="Have a quick question? Reach AiTechWorlds via email, WhatsApp, Telegram, or LinkedIn — remote-first, replying to clients worldwide."
        path="/contact"
        keywords={['contact AiTechWorlds', 'hire a developer', 'software company contact']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">
            <Mail size={16} className="mr-2" />
            Quick Inquiry
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Have a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Question?</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Reach out for general questions, quick quotes, or anything else. Ready to kick off a full project?{' '}
            <Link to="/order" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Submit a project order →
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5 bg-gradient-to-br from-primary-700 to-primary-900 text-white p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-primary-100">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageCircle className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">WhatsApp / Telegram</h3>
                    <p className="text-primary-100">
                      <a href={whatsappChatLink("Hi AiTechWorlds! I have a quick question.")} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Chat on WhatsApp
                      </a><br />
                      <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Message on Telegram
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Linkedin className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">LinkedIn</h3>
                    <p className="text-primary-100">
                      <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        linkedin.com/company/aitechworlds
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Availability</h3>
                    <p className="text-primary-100">Remote-first — serving clients worldwide</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/20">
                <h3 className="text-xl font-semibold mb-4">Response Time</h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                  We typically reply within 24 hours by email, and even faster via Telegram or WhatsApp.
                </p>
              </div>
            </div>
            
            <div className="md:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>

              {submitted && (
                <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                  Thanks! Your message has been sent — we'll get back to you within 24 hours.
                </div>
              )}
              {submitError && (
                <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Your full name"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="your.email@example.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+1 555-000-0000"
                      {...register('phone')}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company/Institution
                    </label>
                    <input
                      id="company"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your company or institution"
                      {...register('company')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="What is your message about?"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-red-500 text-sm">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="What's your question? We'll get back to you shortly..."
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: {
                        value: 20,
                        message: 'Message must be at least 20 characters'
                      }
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Remote-first note */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-600 to-accent-600 p-10 text-center text-white">
          <Globe size={40} className="mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Remote-First, Worldwide</h3>
          <p className="text-primary-50 max-w-2xl mx-auto">
            AiTechWorlds works with clients across the globe. No office visit needed — everything from consultation to delivery happens online via email, Telegram, or WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;