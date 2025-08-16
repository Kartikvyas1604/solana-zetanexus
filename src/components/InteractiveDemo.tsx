import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Wallet, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Copy,
  ExternalLink,
  Upload,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NFTTransfer {
  id: string;
  tokenId: string;
  from: string;
  to: string;
  sourceChain: 'solana' | 'zetachain';
  targetChain: 'solana' | 'zetachain';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  gasUsed?: string;
  transactionHash?: string;
}

const InteractiveDemo = () => {
  const [nftMetadata, setNftMetadata] = useState({
    name: '',
    description: '',
    image: '',
    attributes: ''
  });
  
  const [transferData, setTransferData] = useState<{
    tokenId: string;
    recipient: string;
    sourceChain: 'solana' | 'zetachain';
    targetChain: 'solana' | 'zetachain';
  }>({
    tokenId: '',
    recipient: '',
    sourceChain: 'solana',
    targetChain: 'zetachain'
  });
  
  const [transfers, setTransfers] = useState<NFTTransfer[]>([
    {
      id: '1',
      tokenId: 'NFT-001',
      from: '7xKXtg2CW87d...9WiG5',
      to: '0x742d35Cc6...C09B8E5',
      sourceChain: 'solana',
      targetChain: 'zetachain',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 300000),
      gasUsed: '0.001 SOL',
      transactionHash: '5j7s8K9mN2pQ...'
    },
    {
      id: '2',
      tokenId: 'NFT-002',
      from: '0x8ba1f109...e49c',
      to: 'BQWWFhzBdw2v...L9Xj',
      sourceChain: 'zetachain',
      targetChain: 'solana',
      status: 'pending',
      timestamp: new Date(Date.now() - 60000),
      gasUsed: '0.0005 ZETA'
    }
  ]);

  const { toast } = useToast();

  const handleMintNFT = async () => {
    if (!nftMetadata.name || !nftMetadata.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate minting process
    toast({
      title: "Minting NFT...",
      description: "Your cross-chain NFT is being created"
    });

    setTimeout(() => {
      const newTransfer: NFTTransfer = {
        id: Date.now().toString(),
        tokenId: `NFT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        from: 'System',
        to: '7xKXtg2CW87d...9WiG5',
        sourceChain: 'solana',
        targetChain: 'solana',
        status: 'confirmed',
        timestamp: new Date(),
        gasUsed: '0.001 SOL',
        transactionHash: `${Math.random().toString(36).substring(2, 15)}...`
      };

      setTransfers(prev => [newTransfer, ...prev]);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Token ID: ${newTransfer.tokenId}`,
      });
    }, 2000);
  };

  const handleTransferNFT = async () => {
    if (!transferData.tokenId || !transferData.recipient) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Initiating Cross-Chain Transfer...",
      description: "Your NFT is being transferred via ZetaChain gateway"
    });

    setTimeout(() => {
      const newTransfer: NFTTransfer = {
        id: Date.now().toString(),
        tokenId: transferData.tokenId,
        from: '7xKXtg2CW87d...9WiG5',
        to: transferData.recipient,
        sourceChain: transferData.sourceChain,
        targetChain: transferData.targetChain,
        status: 'pending',
        timestamp: new Date(),
        gasUsed: transferData.sourceChain === 'solana' ? '0.001 SOL' : '0.0005 ZETA'
      };

      setTransfers(prev => [newTransfer, ...prev]);
      
      toast({
        title: "Transfer Initiated!",
        description: "Cross-chain transfer is being processed"
      });

      // Simulate confirmation after 10 seconds
      setTimeout(() => {
        setTransfers(prev => 
          prev.map(t => 
            t.id === newTransfer.id 
              ? { ...t, status: 'confirmed' as const, transactionHash: `${Math.random().toString(36).substring(2, 15)}...` }
              : t
          )
        );
        
        toast({
          title: "Transfer Confirmed!",
          description: "NFT successfully transferred cross-chain"
        });
      }, 10000);
    }, 1500);
  };

  const getStatusIcon = (status: NFTTransfer['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-secondary" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: NFTTransfer['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  return (
    <section id="examples" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-4">
            <Wallet className="w-4 h-4 mr-2 text-primary" />
            Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Test Cross-Chain</span>
            <br />
            <span className="text-foreground">NFT Operations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of universal NFTs with our interactive demo. 
            Mint, transfer, and track NFTs across ZetaChain and Solana networks.
          </p>
        </div>

        <Tabs defaultValue="mint" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
            <TabsTrigger value="mint">Mint NFT</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Cross-Chain</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="mint" className="space-y-6">
            <Card className="max-w-2xl mx-auto gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Mint Universal NFT
                </CardTitle>
                <CardDescription>
                  Create a new NFT that can be transferred across chains
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nft-name">NFT Name *</Label>
                    <Input
                      id="nft-name"
                      placeholder="My Universal NFT"
                      value={nftMetadata.name}
                      onChange={(e) => setNftMetadata(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nft-image">Image URL</Label>
                    <Input
                      id="nft-image"
                      placeholder="https://example.com/image.png"
                      value={nftMetadata.image}
                      onChange={(e) => setNftMetadata(prev => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-description">Description *</Label>
                  <Textarea
                    id="nft-description"
                    placeholder="A unique cross-chain compatible NFT..."
                    value={nftMetadata.description}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-attributes">Attributes (JSON)</Label>
                  <Textarea
                    id="nft-attributes"
                    placeholder='[{"trait_type": "Color", "value": "Blue"}]'
                    value={nftMetadata.attributes}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, attributes: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleMintNFT} 
                  className="w-full" 
                  variant="hero"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Mint Universal NFT
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-6">
            <Card className="max-w-2xl mx-auto gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Cross-Chain Transfer
                </CardTitle>
                <CardDescription>
                  Transfer your NFT between ZetaChain and Solana
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-id">Token ID *</Label>
                    <Input
                      id="token-id"
                      placeholder="NFT-001"
                      value={transferData.tokenId}
                      onChange={(e) => setTransferData(prev => ({ ...prev, tokenId: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address *</Label>
                    <Input
                      id="recipient"
                      placeholder="0x742d35Cc6...C09B8E5"
                      value={transferData.recipient}
                      onChange={(e) => setTransferData(prev => ({ ...prev, recipient: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Source Chain</Label>
                    <Select
                      value={transferData.sourceChain}
                      onValueChange={(value: 'solana' | 'zetachain') => 
                        setTransferData(prev => ({ ...prev, sourceChain: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="zetachain">ZetaChain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Chain</Label>
                    <Select
                      value={transferData.targetChain}
                      onValueChange={(value: 'solana' | 'zetachain') => 
                        setTransferData(prev => ({ ...prev, targetChain: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="zetachain">ZetaChain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Estimated Fees</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Network Fee:</span>
                      <span>{transferData.sourceChain === 'solana' ? '0.001 SOL' : '0.0005 ZETA'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bridge Fee:</span>
                      <span>0.1 ZETA</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>~$0.15</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleTransferNFT} 
                  className="w-full" 
                  variant="hero"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Initiate Cross-Chain Transfer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  Track all your cross-chain NFT operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transfers.map((transfer) => (
                    <div key={transfer.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transfer.status)}
                          <div>
                            <div className="font-medium">{transfer.tokenId}</div>
                            <div className="text-sm text-muted-foreground">
                              {transfer.from} → {transfer.to}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-1 ${getStatusColor(transfer.status)}`}>
                            {transfer.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {transfer.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Source:</span>
                          <div className="font-medium capitalize">{transfer.sourceChain}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target:</span>
                          <div className="font-medium capitalize">{transfer.targetChain}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gas Used:</span>
                          <div className="font-medium">{transfer.gasUsed}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">TX Hash:</span>
                          <div className="font-medium flex items-center gap-1">
                            {transfer.transactionHash || 'Pending...'}
                            {transfer.transactionHash && (
                              <Button variant="ghost" size="icon" className="h-4 w-4">
                                <Copy className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Info */}
        <div className="mt-16 text-center">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Build?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This demo showcases the core functionality. Integrate the actual Solana program 
              and ZetaChain gateway to enable real cross-chain NFT operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="https://github.com/zeta-chain/protocol-contracts-solana" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Solana Gateway
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.zetachain.com/docs/developers/chains/solana/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;