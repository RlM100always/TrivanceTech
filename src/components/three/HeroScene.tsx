import { Suspense, lazy, useEffect, useState } from 'react';

const ConstellationScene = lazy(() => import('./ConstellationScene'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

interface HeroSceneProps {
  className?: string;
}

const HeroScene: React.FC<HeroSceneProps> = ({ className }) => {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (!supportsWebGL()) return;
    setCanRender(true);
  }, []);

  if (!canRender) return null;

  return (
    <Suspense fallback={null}>
      <ConstellationScene className={className} />
    </Suspense>
  );
};

export default HeroScene;
