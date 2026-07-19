import React from 'react';

/**
 * Section — a vertical page band matching the home page's rhythm.
 *
 * `tone` controls how the band sits over the ambient atmosphere:
 *   - 'plain'  → fully transparent; the field shows through at full strength
 *   - 'muted'  → the frosted neutral band used between home sections
 *   - 'accent' → a soft primary-tinted band for CTA / highlight moments
 *
 * Alternate 'plain' and 'muted' down a page to get home's banded cadence.
 */
type SectionTone = 'plain' | 'muted' | 'accent';

interface SectionProps {
  children: React.ReactNode;
  tone?: SectionTone;
  /** Tighter vertical padding for secondary bands. */
  compact?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
}

const TONES: Record<SectionTone, string> = {
  plain: 'bg-transparent',
  muted: 'bg-neutral-50/80 backdrop-blur-xl dark:bg-neutral-950/50',
  accent:
    'bg-primary-50/70 backdrop-blur-xl dark:bg-primary-950/30',
};

const Section: React.FC<SectionProps> = ({
  children,
  tone = 'plain',
  compact = false,
  className = '',
  containerClassName = '',
  id,
}) => (
  <section
    id={id}
    className={`relative overflow-hidden ${TONES[tone]} ${
      compact ? 'py-12 sm:py-16' : 'py-20 sm:py-24'
    } ${className}`}
  >
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${containerClassName}`}>{children}</div>
  </section>
);

export default Section;
