import { useEffect, useState } from 'react';
import HomeAtmosphere from '../components/three/HomeAtmosphere';
import ProductFactoryHero from '../components/sections/ProductFactoryHero';
import TrustStrip from '../components/sections/TrustStrip';
import HomeValue from '../components/sections/HomeValue';
import PremiumServices from '../components/sections/PremiumServices';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import ProcessSection from '../components/sections/ProcessSection';
import Testimonials from '../components/sections/Testimonials';
import CallToAction from '../components/sections/CallToAction';
import SEO, { SITE_URL } from '../components/seo/SEO';
import { SOCIAL_LINKS, CONTACT_EMAIL } from '../utils/socialLinks';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AiTechWorlds',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'AiTechWorlds is a remote-first AI & technology solutions company delivering web development, mobile apps, AI/ML, cybersecurity, and academic project support to clients worldwide.',
  email: CONTACT_EMAIL,
  sameAs: [
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.x,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.pinterest,
    SOCIAL_LINKS.quora,
  ],
};

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const Home = () => {
  const [showAtmosphere, setShowAtmosphere] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && supportsWebGL()) setShowAtmosphere(true);
  }, []);

  return (
    <div className="relative">
      {/* Full-page ambient background flowing behind every section */}
      {showAtmosphere && (
        <HomeAtmosphere className="pointer-events-none fixed inset-0 z-0 opacity-70 dark:opacity-100" />
      )}

      <div className="relative z-10">
      <SEO
        title="AiTechWorlds — AI, Web, Mobile & Software Solutions Worldwide"
        description="Remote-first AI & technology company delivering web development, mobile apps, AI/ML solutions, cybersecurity, and academic project support to clients worldwide."
        path="/"
        keywords={['AiTechWorlds', 'web development company', 'AI solutions', 'mobile app development', 'remote software agency']}
        jsonLd={organizationJsonLd}
      />
      <ProductFactoryHero />
      <TrustStrip />
      <HomeValue />
      <PremiumServices limit={6} />
      <FeaturedProjects />
      <ProcessSection />
      <Testimonials featured />
      <CallToAction />
      </div>
    </div>
  );
};

export default Home;