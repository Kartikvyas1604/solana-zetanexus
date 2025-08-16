import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import NFTStudio from '@/components/NFTStudio';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import SecurityFeatures from '@/components/SecurityFeatures';
import Documentation from '@/components/Documentation';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <NFTStudio />
      <TechnicalSpecs />
      <SecurityFeatures />
      <Documentation />
      <Footer />
    </div>
  );
};

export default Index;
