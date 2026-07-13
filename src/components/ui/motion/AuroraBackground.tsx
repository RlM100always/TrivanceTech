import React from 'react';

interface AuroraBackgroundProps {
  className?: string;
  /** Opacity of the whole aurora layer. */
  intensity?: number;
}

/**
 * Soft, slowly-drifting aurora mesh built from a few blurred gradient blobs.
 * Pure CSS animation (defined in index.css). Sits behind content; pass
 * `pointer-events-none` via className so it never blocks interaction.
 */
const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  intensity = 1,
}) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: intensity }}
    >
      <div className="aurora-blob aurora-blob--1 absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full bg-primary-500/30 blur-3xl" />
      <div className="aurora-blob aurora-blob--2 absolute -right-1/4 top-1/3 h-[55vh] w-[55vh] rounded-full bg-accent-500/25 blur-3xl" />
      <div className="aurora-blob aurora-blob--3 absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full bg-secondary-500/25 blur-3xl" />
    </div>
  );
};

export default AuroraBackground;
