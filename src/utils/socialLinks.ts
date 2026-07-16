export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/aitechworlds',
  facebook: 'https://web.facebook.com/aitechworldsfacebook/',
  x: 'https://x.com/AiTechWorlds',
  instagram: 'https://www.instagram.com/aitechworldsinsta/',
  youtube: 'https://www.youtube.com/@infoaitechworlds',
  telegram: 'https://t.me/aitechworldschannel',
  whatsappChannel: 'https://www.whatsapp.com/channel/0029Vb7q7hTL7UVQ95jrXw3s',
  pinterest: 'https://www.pinterest.com/AiTechWorlds/',
  quora: 'https://www.quora.com/profile/AiTechWorlds',
} as const;

export const CONTACT_EMAIL = 'infoaitechworlds@gmail.com';

export const WHATSAPP_NUMBER = '8801825008451';

export const whatsappChatLink = (message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

// Build a wa.me link to any number (e.g. a client's WhatsApp captured on the
// contact/order form) so an admin can click through to message them directly.
export const whatsappLinkTo = (rawNumber: string, message?: string): string => {
  const digits = rawNumber.replace(/[^\d]/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
