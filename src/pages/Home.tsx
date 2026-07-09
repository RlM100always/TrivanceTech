import PremiumHero from '../components/sections/PremiumHero';
import PremiumAbout from '../components/sections/PremiumAbout';
import PremiumServices from '../components/sections/PremiumServices';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Testimonials from '../components/sections/Testimonials';
import CallToAction from '../components/sections/CallToAction';

const Home = () => {
  return (
    <div>
      <PremiumHero />
      <PremiumAbout compact />
      <PremiumServices limit={3} />
      <FeaturedProjects />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;