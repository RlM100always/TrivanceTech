import React from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { EASE_OUT } from '../../../lib/motion';

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode;
  highlight?: string;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Animated section header: a pill "eyebrow", a headline with an optional
 * gradient-highlighted word, and a description. The headline draws an
 * underline that scales in on scroll.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  highlight,
  description,
  align = 'center',
  className = '',
  children,
}) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  const renderTitle = () => {
    if (!highlight || typeof title !== 'string' || !title.includes(highlight)) {
      return title;
    }
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          {eyebrowIcon}
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
        {renderTitle()}
      </h2>
      {align === 'center' && (
        <motion.span
          className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
          style={{ originX: 0.5 }}
        />
      )}
      {description && (
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
};

export default SectionHeading;
