import { useEffect, useState } from 'react';

/**
 * Returns true only when it's appropriate to mount a WebGL ambient background:
 * the device can actually create a GL context and the user hasn't asked for
 * reduced motion. Always false on the first render so SSR/hydration and the
 * no-WebGL path agree.
 *
 * Extracted from Home so every page gates the atmosphere identically.
 */
const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

export const useAmbientBackground = (): boolean => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => setEnabled(!mq.matches && supportsWebGL());
    evaluate();
    mq.addEventListener('change', evaluate);
    return () => mq.removeEventListener('change', evaluate);
  }, []);

  return enabled;
};

export default useAmbientBackground;
