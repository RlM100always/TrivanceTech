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

const Home = () => {
  return (
    <div>
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
      <PremiumServices limit={3} />
      {/* Mid-page dark band for depth/contrast — forced dark regardless of theme */}
      <div className="dark">
        <FeaturedProjects />
      </div>
      <ProcessSection />
      <Testimonials featured />
      <CallToAction />
    </div>
  );
};

export default Home;