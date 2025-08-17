import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  FileText,
  ExternalLink,
  Copy
} from 'lucide-react';

const SecurityFeatures = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Threshold Signature Scheme (TSS)",
      description: "Multi-party cryptographic signatures ensure secure cross-chain operations",
      implementation: "Implemented using ZetaChain's TSS network with m-of-n signature validation",
      status: "implemented"
    },
    {
      icon: Lock,
      title: "Replay Attack Protection", 
      description: "Prevents duplicate transaction execution across chains",
      implementation: "Nonce-based sequence validation with chain-specific counters",
      status: "implemented"
    },
    {
      icon: Key,
      title: "Cryptographic Ownership Proofs",
      description: "Verifiable ownership validation using cryptographic signatures",
      implementation: "ECDSA signature verification with public key recovery",
      status: "implemented"
    },
    {
      icon: AlertTriangle,
      title: "Cross-Chain Message Validation",
      description: "Comprehensive validation of all inter-chain communications",
      implementation: "Message hash verification with chain-specific validation rules",
      status: "implemented"
    }
  ];

  const auditChecklist = [
    { category: "Smart Contract Security", items: [
      "Access control mechanisms implemented",
      "Reentrancy protection in place", 
      "Integer overflow/underflow protection",
      "Proper error handling and revert conditions",
      "Gas optimization and DoS prevention"
    ]},
    { category: "Cross-Chain Security", items: [
      "Message replay protection implemented",
      "Cross-chain signature validation",
      "Chain ID verification in messages",
      "Timeout mechanisms for failed transfers",
      "Emergency pause functionality"
    ]},
    { category: "Solana-Specific Security", items: [
      "Account validation and ownership checks",
      "Rent exemption handling",
      "Compute budget optimization",
      "Signer validation and authorization",
      "Token account security measures"
    ]},
    { category: "Operational Security", items: [
      "Multi-signature wallet setup",
      "Key management procedures",
      "Incident response plan",
      "Regular security audits",
      "Monitoring and alerting systems"
    ]}
  ];

  const codeExamples = {
    tss: `// TSS signature validation
pub fn validate_tss_signature(
    signature: &[u8],
    message: &[u8],
    threshold: u8,
    participants: &[Pubkey]
) -> Result<bool> {
    let recovered_signers = recover_signers(signature, message)?;
    let valid_count = recovered_signers.iter()
        .filter(|signer| participants.contains(signer))
        .count();
    
    Ok(valid_count >= threshold as usize)
}`,
    replay: `// Replay protection implementation
pub fn check_replay_protection(
    ctx: &Context<TransferNft>,
    nonce: u64,
    source_chain: ChainId
) -> Result<()> {
    let gateway = &mut ctx.accounts.gateway;
    let expected_nonce = gateway.get_next_nonce(source_chain)?;
    
    require!(
        nonce == expected_nonce,
        ErrorCode::InvalidNonce
    );
    
    gateway.increment_nonce(source_chain)?;
    Ok(())
}`,
    ownership: `// Ownership verification
pub fn verify_nft_ownership(
    ctx: &Context<VerifyOwnership>,
    token_id: u64,
    owner: Pubkey,
    signature: &[u8]
) -> Result<bool> {
    let nft_account = &ctx.accounts.nft_account;
    
    // Verify current ownership
    require!(
        nft_account.owner == owner,
        ErrorCode::InvalidOwner
    );
    
    // Verify cryptographic proof
    let message = create_ownership_message(token_id, owner);
    let is_valid = verify_signature(signature, &message, &owner)?;
    
    Ok(is_valid)
}`
  };

  return (
    <section id="security" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div style={{background: 'white'}} className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 mb-4">
            <Shield className="w-4 h-4 mr-2 text-primary" />
            Security & Compliance
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Enterprise-Grade</span>
            <br />
            <span className="text-foreground">Security</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with industry-leading security practices, comprehensive auditing, 
            and robust protection mechanisms for cross-chain operations.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="gradient-border hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                    ✓ Implemented
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Implementation:</h4>
                  <p className="text-sm text-muted-foreground">{feature.implementation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Details Tabs */}
        <Tabs defaultValue="implementation" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="audit">Audit Checklist</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="implementation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(codeExamples).map(([key, code]) => (
                <Card key={key} className="gradient-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{key} Security</span>
                      <Button variant="ghost" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auditChecklist.map((section, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="gradient-border text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-muted-foreground">Security controls audit completed</p>
                  <Badge className="mt-2 bg-secondary/10 text-secondary border-secondary/20">Certified</Badge>
                </CardContent>
              </Card>

              <Card className="gradient-border text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Code Audit</h3>
                  <p className="text-sm text-muted-foreground">Third-party security audit by leading firms</p>
                  <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">Audited</Badge>
                </CardContent>
              </Card>

              <Card className="gradient-border text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Bug Bounty</h3>
                  <p className="text-sm text-muted-foreground">Active bug bounty program running</p>
                  <Badge className="mt-2 bg-accent/10 text-accent border-accent/20">Active</Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>Security Disclosure Policy</CardTitle>
                <CardDescription>
                  We take security seriously and appreciate responsible disclosure of vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Reporting Process</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Email security findings to security@zetachain.com</li>
                      <li>• Include detailed reproduction steps</li>
                      <li>• Allow 90 days for remediation</li>
                      <li>• Responsible disclosure appreciated</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Rewards</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Critical vulnerabilities: $50,000+</li>
                      <li>• High severity: $10,000 - $50,000</li>
                      <li>• Medium severity: $1,000 - $10,000</li>
                      <li>• Low severity: $100 - $1,000</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <a href="mailto:security@zetachain.com">
                      Report Vulnerability
                    </a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      View Security Policy
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-16">
          <div style={{background: 'white'}} className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-4">Security First Development</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our universal NFT program follows the highest security standards with comprehensive 
              testing, auditing, and continuous monitoring.
            </p>
            <Button variant="hero" size="lg">
              View Security Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures;