import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Send, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Wallet,
  Upload,
  Eye,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  Download,
  Zap,
  Shield
} from 'lucide-react';
import { useCrossChainNFT } from '@/hooks/useCrossChainNFT';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';

const NFTStudio = () => {
  const { connected } = useWallet();
  
  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && !!(window as any).ethereum;
  };

  const {
    nfts,
    loading,
    evmAddress,
    solanaAddress,
    solanaBalance,
    evmBalance,
    connectEVMWallet,
    mintSolanaNFT,
    mintEVMNFT,
    initiateCrossChainTransfer,
    verifyNFTOwnership,
    deleteNFT,
    refreshNFTs,
    exportNFTData
  } = useCrossChainNFT();

  const [mintForm, setMintForm] = useState({
    name: '',
    description: '',
    image: '',
    attributes: [{ trait_type: 'Type', value: 'Universal NFT' }]
  });

  const [transferForm, setTransferForm] = useState({
    targetChain: '',
    recipientAddress: ''
  });

  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('mint');

  const handleMintFormChange = (field: string, value: string) => {
    setMintForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...mintForm.attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setMintForm(prev => ({ ...prev, attributes: newAttributes }));
  };

  const addAttribute = () => {
    setMintForm(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const removeAttribute = (index: number) => {
    if (mintForm.attributes.length === 1) {
      toast.error('At least one attribute is required');
      return;
    }
    setMintForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!mintForm.name.trim()) {
      toast.error('NFT name is required');
      return false;
    }
    if (!mintForm.description.trim()) {
      toast.error('NFT description is required');
      return false;
    }
    if (mintForm.name.length > 100) {
      toast.error('NFT name must be less than 100 characters');
      return false;
    }
    if (mintForm.description.length > 500) {
      toast.error('NFT description must be less than 500 characters');
      return false;
    }
    return true;
  };

  const handleMintSolana = async () => {
    if (!validateForm()) return;
    
    const metadata = {
      name: mintForm.name,
      description: mintForm.description,
      image: mintForm.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(mintForm.name)}`,
      attributes: mintForm.attributes.filter(attr => attr.trait_type && attr.value)
    };

    const result = await mintSolanaNFT(metadata);
    if (result) {
      // Reset form on success
      setMintForm({
        name: '',
        description: '',
        image: '',
        attributes: [{ trait_type: 'Type', value: 'Universal NFT' }]
      });
      // Switch to collection tab to see the new NFT
      setActiveTab('collection');
    }
  };

  const handleMintEVM = async () => {
    if (!validateForm()) return;

    const metadata = {
      name: mintForm.name,
      description: mintForm.description,
      image: mintForm.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(mintForm.name)}`,
      attributes: mintForm.attributes.filter(attr => attr.trait_type && attr.value)
    };

    const result = await mintEVMNFT(metadata);
    if (result) {
      // Reset form on success
      setMintForm({
        name: '',
        description: '',
        image: '',
        attributes: [{ trait_type: 'Type', value: 'Universal NFT' }]
      });
      // Switch to collection tab to see the new NFT
      setActiveTab('collection');
    }
  };

  const handleTransfer = async () => {
    if (!selectedNFT || !transferForm.targetChain || !transferForm.recipientAddress) {
      toast.error('Please fill in all transfer details');
      return;
    }

    // Basic address validation
    if (transferForm.targetChain === 'solana' && transferForm.recipientAddress.length < 32) {
      toast.error('Invalid Solana address format');
      return;
    }
    if (transferForm.targetChain === 'ethereum' && !transferForm.recipientAddress.startsWith('0x')) {
      toast.error('Invalid Ethereum address format');
      return;
    }

    await initiateCrossChainTransfer(
      selectedNFT,
      transferForm.targetChain as any,
      transferForm.recipientAddress
    );

    setSelectedNFT(null);
    setTransferForm({ targetChain: '', recipientAddress: '' });
    setActiveTab('transfer');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500 animate-pulse';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${description} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section id="nft-studio" data-testid="nft-studio" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Palette className="w-4 h-4 mr-2" />
            Universal NFT Studio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Create & Transfer <span className="gradient-text">Cross-Chain NFTs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mint NFTs on Solana or EVM chains and transfer them seamlessly across networks using ZetaChain's gateway protocol.
          </p>
        </div>

        {/* Wallet Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="gradient-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Solana Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {connected ? `Balance: ${solanaBalance.toFixed(4)} SOL` : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connected ? (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Connected
                  </Badge>
                ) : (
                  <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !text-sm" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">EVM Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {evmAddress ? `Balance: ${evmBalance.toFixed(4)} ETH` : 'Not connected'}
                    </p>
                  </div>
                </div>
                {evmAddress ? (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Connected
                  </Badge>
                ) : (
                  <div className="flex flex-col gap-2">
                    {!isMetaMaskAvailable() ? (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          MetaMask not detected
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => window.open('https://metamask.io/', '_blank')}
                          className="w-full"
                        >
                          Install MetaMask
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={connectEVMWallet} 
                        disabled={loading}
                        className="w-full"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        {loading ? 'Connecting...' : 'Connect EVM'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mint">Mint NFT</TabsTrigger>
            <TabsTrigger value="collection">
              My Collection ({nfts.length})
            </TabsTrigger>
            <TabsTrigger value="transfer">Cross-Chain Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="mint" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mint Form */}
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Create New NFT</CardTitle>
                  <CardDescription>
                    Mint your NFT on Solana or EVM-compatible chains with ZetaChain interoperability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">NFT Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Universal NFT"
                      value={mintForm.name}
                      onChange={(e) => handleMintFormChange('name', e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      {mintForm.name.length}/100 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your NFT and its unique properties..."
                      value={mintForm.description}
                      onChange={(e) => handleMintFormChange('description', e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      {mintForm.description.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      value={mintForm.image}
                      onChange={(e) => handleMintFormChange('image', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate a unique visual
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>NFT Attributes</Label>
                    {mintForm.attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Trait type (e.g., Color)"
                          value={attr.trait_type}
                          onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                        />
                        <Input
                          placeholder="Value (e.g., Blue)"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAttribute(index)}
                          disabled={mintForm.attributes.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addAttribute} className="w-full">
                      Add Attribute
                    </Button>
                  </div>

                  {loading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing...</span>
                        <span>Please wait</span>
                      </div>
                      <Progress value={33} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t">
                    <Button
                      onClick={handleMintSolana}
                      disabled={loading || !connected}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Minting on Solana...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Mint on Solana
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleMintEVM}
                      disabled={loading || !evmAddress}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Minting on EVM...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Mint on EVM
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>NFT Preview</CardTitle>
                  <CardDescription>
                    Preview how your NFT will appear once minted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {mintForm.image ? (
                      <img
                        src={mintForm.image}
                        alt="NFT Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(mintForm.name || 'preview')}`;
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        {mintForm.name ? (
                          <img
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(mintForm.name)}`}
                            alt="Generated Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto mb-2" />
                            <p>Auto-generated visual</p>
                          </>
                        )}
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        Universal NFT
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {mintForm.name || 'Untitled NFT'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {mintForm.description || 'No description provided'}
                  </p>
                  {mintForm.attributes.some(attr => attr.trait_type && attr.value) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {mintForm.attributes
                          .filter(attr => attr.trait_type && attr.value)
                          .map((attr, index) => (
                            <div key={index} className="bg-muted/50 p-2 rounded text-xs">
                              <div className="text-muted-foreground">{attr.trait_type}</div>
                              <div className="font-medium">{attr.value}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collection">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Your NFT Collection</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refreshNFTs}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                {nfts.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportNFTData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </div>

            {nfts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No NFTs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first universal NFT to get started
                  </p>
                  <Button onClick={() => setActiveTab('mint')}>
                    Start Minting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Card key={nft.id} className="overflow-hidden gradient-border hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="text-xs bg-background/90">
                          {nft.sourceChain}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(nft.transferStatus)}`} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold truncate pr-2">{nft.name}</h3>
                        {getStatusIcon(nft.transferStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {nft.description}
                      </p>
                      <div className="text-xs text-muted-foreground mb-3">
                        Created: {formatDate(nft.createdAt)}
                      </div>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{nft.name}</DialogTitle>
                              <DialogDescription>
                                NFT Details and Transaction Information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                              <div className="space-y-2">
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm text-muted-foreground">{nft.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Source Chain:</span>
                                  <p className="font-medium capitalize">{nft.sourceChain}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <p className="font-medium capitalize">{nft.transferStatus}</p>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Owner:</span>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-xs break-all">{nft.owner}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(nft.owner, 'Owner address')}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                {nft.transactionHash && (
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">Transaction:</span>
                                    <div className="flex items-center gap-2">
                                      <p className="font-mono text-xs break-all">{nft.transactionHash.slice(0, 20)}...</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(nft.transactionHash!, 'Transaction hash')}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => verifyNFTOwnership(nft)}
                                  variant="outline"
                                  className="flex-1"
                                  disabled={loading}
                                >
                                  Verify Ownership
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    deleteNFT(nft.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setSelectedNFT(nft)}
                              disabled={nft.transferStatus === 'pending'}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Transfer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cross-Chain Transfer</DialogTitle>
                              <DialogDescription>
                                Transfer your NFT to another blockchain network using ZetaChain
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded object-cover" />
                                <div>
                                  <h4 className="font-medium">{nft.name}</h4>
                                  <p className="text-sm text-muted-foreground">From: {nft.sourceChain}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Target Chain</Label>
                                <Select onValueChange={(value) => setTransferForm(prev => ({ ...prev, targetChain: value }))}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select target chain" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {nft.sourceChain !== 'solana' && <SelectItem value="solana">Solana</SelectItem>}
                                    {nft.sourceChain !== 'ethereum' && <SelectItem value="ethereum">Ethereum</SelectItem>}
                                    {nft.sourceChain !== 'zetachain' && <SelectItem value="zetachain">ZetaChain</SelectItem>}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Recipient Address</Label>
                                <Input
                                  placeholder="Enter recipient address"
                                  value={transferForm.recipientAddress}
                                  onChange={(e) => setTransferForm(prev => ({ ...prev, recipientAddress: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Make sure the address format matches the target chain
                                </p>
                              </div>
                              {loading && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Initiating transfer...</span>
                                  </div>
                                  <Progress value={66} className="w-full" />
                                </div>
                              )}
                              <Button 
                                onClick={handleTransfer}
                                disabled={loading || !transferForm.targetChain || !transferForm.recipientAddress}
                                className="w-full"
                              >
                                {loading ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Processing Transfer...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Initiate Transfer
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle>Cross-Chain Transfer Status</CardTitle>
                <CardDescription>
                  Monitor your cross-chain NFT transfers powered by ZetaChain gateway protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nfts.filter(nft => nft.transferStatus !== 'idle').length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No transfers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start a cross-chain transfer from your collection
                    </p>
                    <Button onClick={() => setActiveTab('collection')}>
                      View Collection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nfts
                      .filter(nft => nft.transferStatus !== 'idle')
                      .map((nft) => (
                        <div key={nft.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img
                              src={nft.image}
                              alt={nft.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{nft.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {nft.sourceChain} → {nft.targetChain}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(nft.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(nft.transferStatus)}`} />
                                <span className="text-sm capitalize font-medium">{nft.transferStatus}</span>
                              </div>
                              {nft.transactionHash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => copyToClipboard(nft.transactionHash!, 'Transaction hash')}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Tx
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default NFTStudio;
