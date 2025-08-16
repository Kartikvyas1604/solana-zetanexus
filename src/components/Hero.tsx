import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Network } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Cross-chain NFT background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl floating"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="slide-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-8">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            ZetaChain × Solana Integration
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Universal NFTs</span>
            <br />
            <span className="text-foreground">Cross-Chain Native</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Seamlessly mint, transfer, and manage NFTs between ZetaChain, Solana, and EVM chains. 
            Experience true interoperability with TSS security and optimized compute budgets.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-border/30">
              <Shield className="w-4 h-4 mr-2 text-secondary" />
              <span className="text-sm font-medium">TSS Security</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-border/30">
              <Network className="w-4 h-4 mr-2 text-accent" />
              <span className="text-sm font-medium">Cross-Chain Native</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-border/30">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Solana Optimized</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !px-8 !py-4 !text-lg !font-medium" />
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => {
                const docsSection = document.getElementById('docs');
                docsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Documentation
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => {
                const nftStudio = document.querySelector('[data-testid="nft-studio"]') || document.getElementById('nft-studio');
                if (nftStudio) {
                  nftStudio.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback: scroll to bottom where NFTStudio should be
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
              }}
            >
              Launch NFT Studio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-border/30">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">Universal</div>
              <div className="text-sm text-muted-foreground">Cross-Chain Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">Instant</div>
              <div className="text-sm text-muted-foreground">ZetaChain Gateway</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">Secure</div>
              <div className="text-sm text-muted-foreground">TSS Protocol</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">Optimized</div>
              <div className="text-sm text-muted-foreground">Solana Native</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;