import React from 'react';

/**
 * Eyebrow — the small tinted pill that labels a section, matching the one on
 * the home page's "Why teams choose us" block.
 */
interface EyebrowProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Eyebrow: React.FC<EyebrowProps> = ({ children, icon, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600 backdrop-blur dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400 ${className}`}
  >
    {icon}
    {children}
  </span>
);

export default Eyebrow;
