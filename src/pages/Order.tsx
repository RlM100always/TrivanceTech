import { Link } from 'react-router-dom';
import OrderForm from '../components/forms/OrderForm';
import { ClipboardCheck, Clock, HelpCircle, DollarSign, MessageCircle, Rocket } from 'lucide-react';
import { CONTACT_EMAIL, whatsappChatLink } from '../utils/socialLinks';
import PageShell from '../components/ui/layout/PageShell';
import PageHero from '../components/ui/layout/PageHero';
import Section from '../components/ui/layout/Section';
import GlassCard from '../components/ui/layout/GlassCard';
import Reveal, { StaggerContainer, StaggerItem } from '../components/ui/motion/Reveal';

const STEPS = [
  { title: 'Submit your request', description: 'Fill out the form with project details.' },
  { title: 'Receive a quote', description: "We'll review and provide a quote within 24 hours." },
  { title: 'Development begins', description: 'Once approved, we start working on your project.' },
  { title: 'Delivery & feedback', description: 'Receive your project and provide feedback for revisions.' },
];

const ASSURANCES = [
  { icon: ClipboardCheck, label: 'Quality work' },
  { icon: Clock, label: 'On-time delivery' },
  { icon: HelpCircle, label: '24/7 support' },
  { icon: DollarSign, label: 'Fair, transparent pricing' },
];

const Order = () => {
  return (
    <PageShell>
      <PageHero
        eyebrow="Start a Project"
        eyebrowIcon={<Rocket size={13} />}
        title="Let's put a number on your idea"
        highlight="a number"
        description={
          <>
            Tell us the project type, budget and deadline — we'll come back within 24 hours with a real
            quote and a realistic timeline, no back-and-forth required. Just have a quick question
            first?{' '}
            <Link
              to="/contact"
              className="font-semibold text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              Contact us instead →
            </Link>
          </>
        }
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Order' }]}
      />

      <Section tone="muted" compact>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* How it works */}
          <Reveal direction="up" className="lg:col-span-4">
            <GlassCard interactive={false} className="h-full p-7">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                How it works
              </h2>

              <ol className="mt-6 space-y-6">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-white/10">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Need help?</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Prefer to talk it through first? Message us on WhatsApp for an instant reply:
                </p>
                <a
                  href={whatsappChatLink(
                    'Hi AiTechWorlds! I want to place a project order and have a few questions.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Or email us at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* Assurances + form */}
          <div className="lg:col-span-8">
            <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4" stagger={0.07}>
              {ASSURANCES.map((item) => (
                <StaggerItem key={item.label}>
                  <GlassCard className="h-full p-4 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                      <item.icon size={20} />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {item.label}
                    </h3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal direction="up" className="mt-6">
              <GlassCard interactive={false} className="p-6 sm:p-8">
                <OrderForm />
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </Section>
    </PageShell>
  );
};

export default Order;
