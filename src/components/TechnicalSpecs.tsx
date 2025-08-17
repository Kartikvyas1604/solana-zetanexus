import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Database, Cpu, Network, Shield, Zap, Copy, ExternalLink } from 'lucide-react';

const TechnicalSpecs = () => {
  const codeExamples = {
    mint: `// Mint cross-chain NFT
import { UniversalNFT } from '@zetachain/universal-nft-solana';

const nft = await UniversalNFT.mint({
  recipient: "recipient_address",
  metadata: {
    name: "My Universal NFT",
    description: "Cross-chain compatible NFT",
    image: "ipfs://...",
    attributes: [...]
  },
  targetChain: "solana" // or "zetachain"
});`,
    transfer: `// Transfer NFT cross-chain
const transfer = await nft.transferCrossChain({
  to: "destination_address",
  targetChain: "zetachain",
  gasLimit: 300000,
  feeToken: "ZETA"
});

// Monitor transfer status
const status = await transfer.waitForCompletion();`,
    verify: `// Verify NFT ownership across chains
const ownership = await UniversalNFT.verifyOwnership({
  tokenId: "12345",
  owner: "owner_address",
  sourceChain: "solana",
  targetChain: "zetachain"
});

console.log(ownership.isValid); // true/false`
  };

  const architectureData = [
    {
      component: "Gateway Contract",
      description: "ZetaChain protocol gateway for cross-chain messaging",
      tech: "Solana Program",
      status: "Active"
    },
    {
      component: "NFT Program",
      description: "Universal NFT implementation with cross-chain support",
      tech: "Rust/Anchor",
      status: "Active"
    },
    {
      component: "TSS Security",
      description: "Threshold signature scheme for secure cross-chain operations",
      tech: "Cryptographic",
      status: "Active"
    },
    {
      component: "Compute Optimizer",
      description: "Solana compute budget optimization and rent management",
      tech: "Rust",
      status: "Active"
    }
  ];

  const specifications = [
    { metric: "Cross-Chain Latency", value: "5-10 seconds", icon: Zap },
    { metric: "Supported Chains", value: "Solana + ZetaChain", icon: Network },
    { metric: "Security Model", value: "TSS + Multi-sig", icon: Shield },
    { metric: "Compute Budget", value: "Optimized < 200k CU", icon: Cpu },
    { metric: "Gas Efficiency", value: "~$0.01 per transfer", icon: Database },
    { metric: "Uptime SLA", value: "99.9%", icon: Code }
  ];

  return (
    <section id="docs" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div style={{background: 'white'}} className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 mb-4">
            <Code className="w-4 h-4 mr-2 text-primary" />
            Technical Documentation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Architecture & API</span>
            <br />
            <span className="text-foreground">Reference</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive technical specifications, API documentation, and implementation guides 
            for building with our universal NFT program.
          </p>
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {specifications.map((spec, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <spec.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{spec.metric}</h3>
                <p className="text-2xl font-bold gradient-text">{spec.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Examples and Architecture */}
        <Tabs defaultValue="examples" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(codeExamples).map(([key, code]) => (
                <Card key={key} className="gradient-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{key} NFT</span>
                      <Button variant="ghost" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>System Architecture Components</CardTitle>
                <CardDescription>
                  Core components of the universal NFT program and their interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {architectureData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{item.component}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          {item.tech}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Core Instructions</CardTitle>
                  <CardDescription>Primary program instructions available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'initialize_nft',
                    'mint_nft', 
                    'transfer_nft',
                    'receive_cross_chain_nft',
                    'burn_nft',
                    'verify_ownership'
                  ].map((instruction) => (
                    <div key={instruction} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <code className="text-sm font-mono">{instruction}</code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Account Types</CardTitle>
                  <CardDescription>Data structures used by the program</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'UniversalNft',
                    'CrossChainConfig',
                    'PendingTransfer',
                    'OwnershipProof',
                    'GatewayState',
                    'MetadataAccount'
                  ].map((account) => (
                    <div key={account} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <code className="text-sm font-mono">{account}</code>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="mr-4">
            Get Started Now
          </Button>
          <Button variant="outline" size="lg">
            View Full Documentation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecs;