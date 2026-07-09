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

export const CONTACT_EMAIL = 'contact@aitechworlds.com';

export const WHATSAPP_NUMBER = '8801825008451';

export const whatsappChatLink = (message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
