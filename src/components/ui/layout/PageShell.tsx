import React from 'react';
import HomeAtmosphere from '../../three/HomeAtmosphere';
import useAmbientBackground from '../../../hooks/useAmbientBackground';

/**
 * PageShell — the page-level wrapper that gives every route the same footing as
 * the home page: the drifting WebGL atmosphere fixed behind the viewport, with
 * all page content layered above it in its own stacking context.
 *
 * Sections placed inside should be translucent (see <Section />) so the field
 * reads through them. Pass `atmosphere={false}` for dense, functional screens
 * where the movement would be a distraction.
 */
interface PageShellProps {
  children: React.ReactNode;
  /** Mount the ambient WebGL field. Default true. */
  atmosphere?: boolean;
  className?: string;
}

const PageShell: React.FC<PageShellProps> = ({ children, atmosphere = true, className = '' }) => {
  const ambientOk = useAmbientBackground();
  const showAtmosphere = atmosphere && ambientOk;

  return (
    <div className={`relative min-h-screen ${className}`}>
      {showAtmosphere && (
        <HomeAtmosphere className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-90" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageShell;
