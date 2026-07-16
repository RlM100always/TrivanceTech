import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  className?: string;
}

/**
 * Cloudflare Turnstile widget — keeps the public contact/order forms from being
 * an open spam target. Renders nothing (submit stays disabled) if
 * VITE_TURNSTILE_SITE_KEY isn't configured, so local dev isn't blocked.
 */
const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: onVerify,
          'expired-callback': () => onVerify(''),
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
    };
  }, [onVerify]);

  if (!SITE_KEY) return null;
  if (error) return <p className="text-xs text-red-500">Could not load verification widget. Please refresh.</p>;

  return <div ref={containerRef} className={className} />;
};

export default TurnstileWidget;
