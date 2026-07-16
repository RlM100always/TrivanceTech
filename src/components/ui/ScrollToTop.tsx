import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the window scroll position to the top on every route change.
 *
 * Without this, React Router preserves the previous page's scroll offset, so
 * navigating to a new page can land you halfway down it. We also disable the
 * browser's native scroll restoration so back/forward don't fight this.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
