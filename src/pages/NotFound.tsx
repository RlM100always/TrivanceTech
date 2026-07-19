import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import PageShell from '../components/ui/layout/PageShell';
import ActionButton from '../components/ui/layout/ActionButton';
import Eyebrow from '../components/ui/layout/Eyebrow';
import Reveal from '../components/ui/motion/Reveal';

const NotFound = () => {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
        <Reveal direction="up">
          <Eyebrow icon={<Compass size={13} />}>Error 404</Eyebrow>

          <p className="mt-6 bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-[6rem] font-bold leading-none tracking-tighter text-transparent dark:from-white dark:to-neutral-600 sm:text-[9rem]">
            404
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            This page took a{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
              wrong turn
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            The page you're looking for might have been removed, renamed, or is temporarily
            unavailable.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ActionButton to="/" size="lg">
              <Home size={18} />
              Go Home
            </ActionButton>
            <ActionButton onClick={() => window.history.back()} variant="ghost" size="lg">
              <ArrowLeft size={18} />
              Go Back
            </ActionButton>
          </div>

          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            {[
              { label: 'Services', to: '/services' },
              { label: 'Projects', to: '/projects' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Reveal>
      </div>
    </PageShell>
  );
};

export default NotFound;
