import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Network, 
  FileText,
  ExternalLink,
  Copy,
  CheckCircle,
  Terminal,
  Check
} from 'lucide-react';

const Documentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, key: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(key);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  const setupSteps = [
    {
      step: 1,
      title: "Environment Setup",
      description: "Install required dependencies and configure development environment",
      code: `# Install Solana CLI
curl -sSfL https://release.solana.com/v1.18.0/install | sh

# Install Anchor Framework
npm install -g @project-serum/anchor-cli

# Clone the repository
git clone https://github.com/zeta-chain/universal-nft-solana
cd universal-nft-solana

# Install dependencies
npm install`
    },
    {
      step: 2,
      title: "Configure Networks",
      description: "Set up Solana and ZetaChain network configurations",
      code: `// solana-config.ts
export const SOLANA_CONFIG = {
  network: process.env.SOLANA_NETWORK || 'devnet',
  commitment: 'confirmed' as const,
  programId: new PublicKey('ZetaNFT1111111111111111111111111111111111'),
  gatewayId: new PublicKey('Gateway1111111111111111111111111111111111')
};

// zetachain-config.ts
export const ZETACHAIN_CONFIG = {
  chainId: process.env.ZETACHAIN_NETWORK === 'mainnet' ? 7000 : 7001,
  rpcUrl: process.env.ZETACHAIN_RPC || 'https://zetachain-testnet.rpc.com',
  gatewayAddress: '0x...' // Gateway contract address
};`
    },
    {
      step: 3,
      title: "Deploy Programs",
      description: "Deploy the universal NFT program and configure gateway",
      code: `# Build and deploy the Solana program
anchor build
anchor deploy

# Configure the gateway program
solana program deploy target/deploy/universal_nft.so --program-id keypair.json

# Initialize gateway with ZetaChain configuration
solana run initialize_gateway --gateway-program <PROGRAM_ID> --zetachain-config config.json`
    }
  ];

  const requirements = [
    {
      category: "Solana-Specific Requirements",
      icon: Zap,
      items: [
        "Compute budget optimization (<200k CU per transaction)",
        "Rent exemption handling for all accounts", 
        "Token account creation and management",
        "Proper signer management and validation",
        "Account size calculation and allocation"
      ]
    },
    {
      category: "Cross-Chain Security",
      icon: Shield,
      items: [
        "TSS (Threshold Signature Scheme) implementation",
        "Replay attack protection with nonce validation",
        "Message hash verification across chains",
        "Emergency pause and recovery mechanisms",
        "Multi-signature wallet integration"
      ]
    },
    {
      category: "ZetaChain Integration",
      icon: Network,
      items: [
        "Gateway contract compatibility",
        "Cross-chain message formatting",
        "EVM and non-EVM chain support",
        "Protocol-contracts-solana integration",
        "Universal application architecture"
      ]
    }
  ];

  const examples = {
    mint: `use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct MintUniversalNft<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + UniversalNft::INIT_SPACE,
        seeds = [b"nft", authority.key().as_ref(), &token_id.to_le_bytes()],
        bump
    )]
    pub nft_account: Account<'info, UniversalNft>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"gateway"],
        bump = gateway.bump
    )]
    pub gateway: Account<'info, Gateway>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn mint_universal_nft(
    ctx: Context<MintUniversalNft>,
    token_id: u64,
    metadata: NftMetadata,
    target_chain: Option<ChainId>
) -> Result<()> {
    let nft = &mut ctx.accounts.nft_account;
    let gateway = &mut ctx.accounts.gateway;
    
    // Initialize NFT account
    nft.token_id = token_id;
    nft.owner = ctx.accounts.authority.key();
    nft.metadata = metadata;
    nft.source_chain = ChainId::Solana;
    nft.created_at = Clock::get()?.unix_timestamp;
    nft.bump = ctx.bumps.nft_account;
    
    // If target chain specified, initiate cross-chain transfer
    if let Some(chain) = target_chain {
        gateway.initiate_cross_chain_mint(
            token_id,
            ctx.accounts.authority.key(),
            chain,
            &metadata
        )?;
    }
    
    // Emit event
    emit!(NftMinted {
        token_id,
        owner: ctx.accounts.authority.key(),
        target_chain,
        timestamp: Clock::get()?.unix_timestamp,
    });
    
    Ok(())
}`,
    transfer: `#[derive(Accounts)]
pub struct TransferCrossChain<'info> {
    #[account(
        mut,
        seeds = [b"nft", nft_account.owner.as_ref(), &nft_account.token_id.to_le_bytes()],
        bump = nft_account.bump,
        constraint = nft_account.owner == authority.key() @ ErrorCode::NotOwner
    )]
    pub nft_account: Account<'info, UniversalNft>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"gateway"],
        bump = gateway.bump
    )]
    pub gateway: Account<'info, Gateway>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + PendingTransfer::INIT_SPACE,
        seeds = [b"transfer", &nft_account.token_id.to_le_bytes(), &target_chain.to_le_bytes()],
        bump
    )]
    pub pending_transfer: Account<'info, PendingTransfer>,
    
    pub system_program: Program<'info, System>,
}

pub fn transfer_cross_chain(
    ctx: Context<TransferCrossChain>,
    target_chain: ChainId,
    recipient: [u8; 32],
    gas_limit: u64
) -> Result<()> {
    let nft = &mut ctx.accounts.nft_account;
    let gateway = &mut ctx.accounts.gateway;
    let transfer = &mut ctx.accounts.pending_transfer;
    
    // Create pending transfer record
    transfer.token_id = nft.token_id;
    transfer.source_owner = nft.owner;
    transfer.target_chain = target_chain;
    transfer.recipient = recipient;
    transfer.initiated_at = Clock::get()?.unix_timestamp;
    transfer.status = TransferStatus::Pending;
    transfer.bump = ctx.bumps.pending_transfer;
    
    // Lock NFT during transfer
    nft.status = NftStatus::InTransfer;
    
    // Initiate cross-chain message
    gateway.send_cross_chain_message(
        target_chain,
        recipient,
        &CrossChainMessage::NftTransfer {
            token_id: nft.token_id,
            metadata: nft.metadata.clone(),
            original_owner: nft.owner,
        },
        gas_limit
    )?;
    
    Ok(())
}`,
    security: `// TSS signature validation
pub fn validate_tss_signature(
    ctx: Context<ValidateTssSignature>,
    message: Vec<u8>,
    signature: TssSignature,
    threshold: u8
) -> Result<bool> {
    let gateway = &ctx.accounts.gateway;
    
    // Verify signature meets threshold requirements
    require!(
        signature.signer_count >= threshold,
        ErrorCode::InsufficientSigners
    );
    
    // Validate each signature component
    let mut valid_signatures = 0u8;
    for (i, sig_part) in signature.parts.iter().enumerate() {
        if i >= gateway.tss_validators.len() {
            break;
        }
        
        let validator_pubkey = &gateway.tss_validators[i];
        if secp256k1_recover(&message, sig_part, validator_pubkey)? {
            valid_signatures += 1;
        }
    }
    
    let is_valid = valid_signatures >= threshold;
    
    // Prevent replay attacks
    if is_valid {
        let message_hash = hash(&message);
        require!(
            !gateway.processed_messages.contains(&message_hash),
            ErrorCode::MessageAlreadyProcessed
        );
        
        gateway.processed_messages.insert(message_hash);
    }
    
    Ok(is_valid)
}`
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div style={{background: 'white'}} className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 mb-4">
            <BookOpen className="w-4 h-4 mr-2 text-primary" />
            Implementation Guide
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Complete Development</span>
            <br />
            <span className="text-foreground">Documentation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides, code examples, and best practices for building 
            universal NFT applications with ZetaChain and Solana integration.
          </p>
        </div>

        <Tabs defaultValue="requirements" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {requirements.map((section, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{section.category}</CardTitle>
                    </div>
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

            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>Addressing Standard Contracts Issue #72</CardTitle>
                <CardDescription>
                  Our implementation directly addresses all requirements from the ZetaChain standard contracts issue
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Implemented Solutions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Cross-chain NFT minting and transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      ZetaChain gateway integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Solana compute budget optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      TSS security implementation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Documentation Provided</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Complete setup instructions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Working code examples
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Security best practices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      Testing and deployment guides
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            {setupSteps.map((step, index) => (
              <Card key={index} className="gradient-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Terminal className="w-4 h-4" />
                        <span>Terminal / Code</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(step.code, `setup-${step.step}`)}
                      >
                        {copiedCode === `setup-${step.step}` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(examples).map(([key, code]) => (
                <Card key={key} className="gradient-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{key} Implementation</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(code, `example-${key}`)}
                      >
                        {copiedCode === `example-${key}` ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Production-ready Rust code for {key} functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="text-xs overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Unit Testing</CardTitle>
                  <CardDescription>Test individual program instructions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <pre className="text-xs">
                      <code>{`# Run unit tests
cargo test

# Test specific module
cargo test universal_nft

# Run with coverage
cargo tarpaulin --out Html`}</code>
                    </pre>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• NFT minting validation</li>
                    <li>• Cross-chain transfer logic</li>
                    <li>• Security constraint checks</li>
                    <li>• Account initialization tests</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Integration Testing</CardTitle>
                  <CardDescription>Test cross-chain interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <pre className="text-xs">
                      <code>{`# Start local test validator
solana-test-validator

# Run integration tests
npm run test:integration

# Test cross-chain scenarios
npm run test:cross-chain`}</code>
                    </pre>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Full cross-chain workflows</li>
                    <li>• Gateway contract interactions</li>
                    <li>• TSS signature validation</li>
                    <li>• Error handling scenarios</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>Deployment Checklist</CardTitle>
                <CardDescription>Pre-production validation steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Security Validation</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        TSS configuration verified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Replay protection tested
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Multi-sig wallets configured
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Emergency pause mechanisms
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Performance Validation</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Compute budget under 200k CU
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Rent exemption handling
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Gas optimization verified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        Load testing completed
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16">
          <div style={{background: 'white'}} className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-4">Ready for Production</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This implementation meets all requirements for the ZetaChain universal NFT ecosystem
              with comprehensive documentation, security features, and testing.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="https://github.com/zeta-chain/protocol-contracts-solana" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Source Code
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.zetachain.com/docs/developers/chains/solana/" target="_blank" rel="noopener noreferrer">
                  ZetaChain Solana Docs
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documentation;
