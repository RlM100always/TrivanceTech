import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { whatsappChatLink } from '../../utils/socialLinks';

const GREETING_DELAY_MS = 4500;
const AUTO_HIDE_MS = 9000;
const SESSION_KEY = 'atw_wa_bubble_shown';
const PREFILLED_MESSAGE = "Hi AiTechWorlds! I'm interested in getting a project started.";

const WhatsAppFloatingButton: React.FC = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const showTimer = setTimeout(() => {
      setShowBubble(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, GREETING_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showBubble) return;
    const hideTimer = setTimeout(() => setShowBubble(false), AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer);
  }, [showBubble]);

  const bubbleVisible = showBubble && !dismissed;

  return (
    // Sits above the mobile BottomNav (and its safe-area inset); at lg the tab
    // bar is gone, so it drops back to a plain corner offset.
    <div
      className="fixed z-40 right-4 sm:right-5 lg:right-8 lg:!bottom-8 flex flex-col items-end gap-3"
      style={{ bottom: 'calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + 1rem)' }}
    >
      {bubbleVisible && (
        <div className="relative max-w-[240px] sm:max-w-xs bg-white dark:bg-neutral-800 rounded-2xl rounded-br-sm shadow-2xl border border-neutral-100 dark:border-neutral-700 p-4 animate-[fadeIn_0.3s_ease-out]">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X size={13} />
          </button>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">👋 Need help choosing a service?</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3 leading-relaxed">
            Chat with our team on WhatsApp — usually replies within minutes.
          </p>
          <a
            href={whatsappChatLink(PREFILLED_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            <MessageCircle size={14} />
            Start chatting
          </a>
        </div>
      )}

      <a
        href={whatsappChatLink(PREFILLED_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AiTechWorlds on WhatsApp"
        className="group relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
        <MessageCircle size={28} className="relative text-white" fill="currentColor" strokeWidth={0} />
      </a>
    </div>
  );
};

export default WhatsAppFloatingButton;
