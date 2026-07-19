import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { staggerContainer, reveal } from '../../../lib/motion';

/**
 * PageHero — the standard opening block for every non-home page.
 *
 * Transparent (the PageShell atmosphere flows behind it), with the same eyebrow
 * pill / gradient-highlighted headline / lead paragraph stack the home hero
 * uses, plus optional breadcrumbs, action buttons and a right-hand aside.
 *
 * The top padding clears the fixed navbar — don't add your own.
 */
export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  /** Substring of `title` rendered in the brand gradient. */
  highlight?: string;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  /** Optional right-column content; switches the hero to a two-column grid. */
  aside?: React.ReactNode;
  align?: 'center' | 'left';
  compact?: boolean;
}

const stagger = staggerContainer(0.1, 0.05);
const item = reveal({ direction: 'up', distance: 20, duration: 0.55 });

const renderTitle = (title: string, highlight?: string) => {
  if (!highlight || !title.includes(highlight)) return title;
  const [before, ...after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
        {highlight}
      </span>
      {after.join(highlight)}
    </>
  );
};

const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  highlight,
  description,
  crumbs,
  actions,
  aside,
  align = 'center',
  compact = false,
}) => {
  const centered = align === 'center' && !aside;

  return (
    <section
      className={`relative overflow-hidden bg-transparent ${
        compact ? 'pb-10 pt-28 sm:pb-14 sm:pt-32' : 'pb-16 pt-32 sm:pb-20 sm:pt-40'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            aside
              ? 'grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8'
              : ''
          }
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className={centered ? 'mx-auto max-w-3xl text-center' : 'text-left'}
          >
            {crumbs && crumbs.length > 0 && (
              <motion.nav
                variants={item}
                aria-label="Breadcrumb"
                className={`mb-5 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 ${
                  centered ? 'justify-center' : ''
                }`}
              >
                {crumbs.map((crumb, i) => (
                  <React.Fragment key={`${crumb.label}-${i}`}>
                    {i > 0 && <ChevronRight size={14} className="opacity-50" />}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="rounded transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-neutral-700 dark:text-neutral-200">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </motion.nav>
            )}

            {eyebrow && (
              <motion.div variants={item} className="mb-5">
                <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
              </motion.div>
            )}

            <motion.h1
              variants={item}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {renderTitle(title, highlight)}
            </motion.h1>

            {description && (
              <motion.p
                variants={item}
                className={`mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg ${
                  centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
                }`}
              >
                {description}
              </motion.p>
            )}

            {actions && (
              <motion.div
                variants={item}
                className={`mt-8 flex flex-col gap-3 sm:flex-row ${
                  centered ? 'sm:justify-center' : ''
                }`}
              >
                {actions}
              </motion.div>
            )}
          </motion.div>

          {aside && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
