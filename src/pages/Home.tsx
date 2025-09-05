import PremiumHero from '../components/sections/PremiumHero';
import PremiumAbout from '../components/sections/PremiumAbout';
import PremiumServices from '../components/sections/PremiumServices';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Testimonials from '../components/sections/Testimonials';
import CallToAction from '../components/sections/CallToAction';
import Services from './Services';
import Products from './Products';

const Home = () => {
  return (
    <div>
      <PremiumHero />
      <PremiumAbout />
      <PremiumServices/>
      <FeaturedProjects />
      <Products/>
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
      

    </div>
  );
};

export default Home;