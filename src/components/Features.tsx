import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Shield, 
  Zap, 
  Code, 
  Lock, 
  Coins, 
  ArrowLeftRight, 
  CheckCircle,
  ExternalLink 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Network,
      title: "Cross-Chain Architecture",
      description: "Native interoperability between ZetaChain and Solana networks with seamless asset transfers.",
      details: [
        "Universal messaging protocol",
        "Automatic chain detection",
        "Optimized gas usage",
        "Real-time synchronization"
      ],
      color: "from-primary to-accent",
      badge: "Core"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "TSS protection, replay attack prevention, and comprehensive security best practices.",
      details: [
        "Threshold Signature Scheme",
        "Multi-signature validation",
        "Replay protection",
        "Formal verification"
      ],
      color: "from-secondary to-secondary-glow",
      badge: "Security"
    },
    {
      icon: Zap,
      title: "Solana Optimization",
      description: "Efficient compute budget management and optimized token account handling.",
      details: [
        "Compute budget optimization",
        "Rent exemption handling",
        "Token account management",
        "Signer validation"
      ],
      color: "from-accent to-primary",
      badge: "Performance"
    },
    {
      icon: Code,
      title: "Developer Experience",
      description: "Comprehensive SDKs, documentation, and examples for rapid development.",
      details: [
        "TypeScript/JavaScript SDK",
        "Rust program library",
        "Interactive examples",
        "Complete documentation"
      ],
      color: "from-secondary to-accent",
      badge: "DX"
    },
    {
      icon: Lock,
      title: "Asset Security",
      description: "Secure custody and transfer of NFTs with cryptographic guarantees.",
      details: [
        "Cryptographic proofs",
        "Immutable ownership",
        "Transfer validation",
        "Recovery mechanisms"
      ],
      color: "from-primary to-secondary",
      badge: "Assets"
    },
    {
      icon: Coins,
      title: "Fee Optimization",
      description: "Minimal transaction costs with intelligent fee management across chains.",
      details: [
        "Dynamic fee calculation",
        "Cross-chain fee estimation",
        "Batch operations",
        "Fee token flexibility"
      ],
      color: "from-accent to-secondary",
      badge: "Economics"
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-4">
            <ArrowLeftRight className="w-4 h-4 mr-2 text-primary" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Everything You Need</span>
            <br />
            <span className="text-foreground">for Cross-Chain NFTs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our universal NFT program provides all the tools and security features needed 
            to build the next generation of cross-chain applications.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 gradient-border glow-effect">
              <div className="p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 mb-4">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2 text-secondary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-muted/50">
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Integration Preview */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Production Ready Implementation</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            This universal NFT program meets all technical requirements for the ZetaChain ecosystem. 
            Ready for deployment with comprehensive security, documentation, and testing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <a href="https://github.com/zeta-chain/protocol-contracts-solana" target="_blank" rel="noopener noreferrer">
                View Solana Gateway Implementation
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.zetachain.com/docs/developers/chains/solana/" target="_blank" rel="noopener noreferrer">
                Technical Documentation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;