import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Network } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#fff' }}>
      {/* Remove all overlays and force white background */}
      <div className="absolute inset-0 z-0" style={{ background: '#fff' }}></div>

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
          <div style={{background: 'rgba(139, 92, 246, 0.1)'}} className="inline-flex items-center px-4 py-2 rounded-full border border-purple-200 text-sm font-medium text-purple-700 mb-8">
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
              <div className="flex items-center px-4 py-2 rounded-full border" style={{ backgroundColor: '#f8f9fa', borderColor: '#8b5cf6' }}>
                <Shield className="w-4 h-4 mr-2" style={{ color: '#8b5cf6' }} />
                <span className="text-sm font-medium" style={{ color: '#8b5cf6' }}>TSS Security</span>
              </div>
              <div className="flex items-center px-4 py-2 rounded-full border" style={{ backgroundColor: '#f8f9fa', borderColor: '#3b82f6' }}>
                <Network className="w-4 h-4 mr-2" style={{ color: '#3b82f6' }} />
                <span className="text-sm font-medium" style={{ color: '#3b82f6' }}>Cross-Chain Native</span>
              </div>
              <div className="flex items-center px-4 py-2 rounded-full border" style={{ backgroundColor: '#f8f9fa', borderColor: '#06b6d4' }}>
                <Zap className="w-4 h-4 mr-2" style={{ color: '#06b6d4' }} />
                <span className="text-sm font-medium" style={{ color: '#06b6d4' }}>Solana Optimized</span>
              </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <WalletMultiButton 
              style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', 
                borderRadius: '0.5rem', 
                padding: '1rem 2rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                border: 'none'
              }} 
            />
            <Button 
              variant="outline" 
              size="lg" 
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.125rem', 
                background: 'white', 
                borderColor: '#8b5cf6', 
                color: '#8b5cf6' 
              }}
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
              style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)', 
                padding: '1rem 2rem', 
                fontSize: '1.125rem',
                color: 'white',
                border: 'none',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
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