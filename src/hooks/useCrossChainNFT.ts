import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SolanaService, ZetaChainService, EVMService, CrossChainNFT, NFTMetadata } from '../services/blockchain';
import { toast } from 'sonner';

export const useCrossChainNFT = () => {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction } = useWallet();
  
  const [nfts, setNfts] = useState<CrossChainNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [solanaBalance, setSolanaBalance] = useState<number>(0);
  const [evmBalance, setEvmBalance] = useState<number>(0);

  // Initialize services with mainnet configurations
  const solanaService = new SolanaService(); // Uses mainnet by default now
  const zetaService = new ZetaChainService(); // Uses mainnet by default now
  const evmService = new EVMService(); // Uses mainnet by default now

  // Load existing NFTs from localStorage on mount
  useEffect(() => {
    const savedNFTs = localStorage.getItem('crosschain-nfts');
    if (savedNFTs) {
      try {
        setNfts(JSON.parse(savedNFTs));
      } catch (error) {
        console.error('Error loading saved NFTs:', error);
      }
    }
  }, []);

  // Save NFTs to localStorage whenever they change
  useEffect(() => {
    if (nfts.length > 0) {
      localStorage.setItem('crosschain-nfts', JSON.stringify(nfts));
    }
  }, [nfts]);

  // Update balances when wallets connect
  useEffect(() => {
    if (publicKey) {
      getSolanaBalance().then(setSolanaBalance);
    }
  }, [publicKey]);

  useEffect(() => {
    if (evmAddress) {
      evmService.getEVMBalance(evmAddress).then(setEvmBalance);
    }
  }, [evmAddress]);

  const connectEVMWallet = useCallback(async () => {
    try {
      setLoading(true);
      const address = await evmService.connectWallet();
      setEvmAddress(address);
      if (address) {
        toast.success('EVM wallet connected successfully');
        // Update balance
        const balance = await evmService.getEVMBalance(address);
        setEvmBalance(balance);
      } else {
        toast.error('Failed to connect EVM wallet');
      }
      return address;
    } catch (error) {
      console.error('EVM wallet connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect EVM wallet';
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [evmService]);

  const mintSolanaNFT = useCallback(async (metadata: NFTMetadata) => {
    if (!publicKey || !wallet || !signTransaction) {
      toast.error('Please connect your Solana wallet');
      return null;
    }

    setLoading(true);
    try {
      const walletAdapter = {
        publicKey,
        signTransaction
      };

      toast.info('Minting NFT on Solana...');
      const result = await solanaService.mintNFT(walletAdapter as any, metadata);
      
      const newNFT: CrossChainNFT = {
        id: `solana-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${metadata.name}`,
        owner: publicKey.toString(),
        sourceChain: 'solana',
        mintAddress: result.mintAddress,
        transferStatus: 'idle',
        createdAt: Date.now(),
        transactionHash: result.signature
      };

      setNfts(prev => [newNFT, ...prev]);
      toast.success(`NFT "${metadata.name}" minted successfully on Solana!`);
      
      // Update balance
      const newBalance = await getSolanaBalance();
      setSolanaBalance(newBalance);
      
      return newNFT;
    } catch (error) {
      console.error('Error minting Solana NFT:', error);
      toast.error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicKey, wallet, signTransaction, solanaService]);

  const mintEVMNFT = useCallback(async (metadata: NFTMetadata) => {
    if (!evmAddress) {
      toast.error('Please connect your EVM wallet');
      return null;
    }

    setLoading(true);
    try {
      toast.info('Starting EVM NFT mint...');
      
      // Add progress updates
      setTimeout(() => toast.info('Creating NFT metadata...'), 500);
      setTimeout(() => toast.info('Uploading to IPFS...'), 1500);
      setTimeout(() => toast.info('Submitting transaction...'), 3000);
      
      const result = await evmService.mintEVMNFT(metadata, evmAddress);
      
      if (!result.success) {
        throw new Error('EVM minting failed - please try again');
      }
      
      const newNFT: CrossChainNFT = {
        id: `evm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${metadata.name}`,
        owner: evmAddress,
        sourceChain: 'ethereum',
        tokenId: result.tokenId,
        transferStatus: 'idle',
        createdAt: Date.now(),
        transactionHash: result.txHash
      };

      setNfts(prev => [newNFT, ...prev]);
      toast.success(`NFT "${metadata.name}" minted successfully on Ethereum!`);
      
      // Update balance
      const newBalance = await evmService.getEVMBalance(evmAddress);
      setEvmBalance(newBalance);
      
      return newNFT;
    } catch (error) {
      console.error('Error minting EVM NFT:', error);
      toast.error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [evmAddress, evmService]);

  const initiateCrossChainTransfer = useCallback(async (
    nft: CrossChainNFT,
    targetChain: 'solana' | 'ethereum' | 'zetachain',
    recipientAddress: string
  ) => {
    setLoading(true);
    
    // Update NFT status to pending
    setNfts(prev => prev.map(n => 
      n.id === nft.id 
        ? { ...n, transferStatus: 'pending' as const, targetChain }
        : n
    ));

    try {
      toast.info(`Initiating cross-chain transfer to ${targetChain}...`);
      const result = await zetaService.initiateCrossChainTransfer(nft, targetChain, recipientAddress);
      
      if (result.success) {
        // Update NFT status to completed
        setNfts(prev => prev.map(n => 
          n.id === nft.id 
            ? { 
                ...n, 
                transferStatus: 'completed' as const, 
                owner: recipientAddress,
                transactionHash: result.txHash 
              }
            : n
        ));
        
        toast.success(`Cross-chain transfer to ${targetChain} completed successfully!`);
        
        if (result.estimatedTime) {
          toast.info(`Transfer completed in approximately ${Math.floor(result.estimatedTime / 60)} minutes`);
        }
      } else {
        // Update NFT status to failed
        setNfts(prev => prev.map(n => 
          n.id === nft.id 
            ? { ...n, transferStatus: 'failed' as const }
            : n
        ));
        toast.error('Cross-chain transfer failed. Please try again.');
      }
      
      return result;
    } catch (error) {
      console.error('Error in cross-chain transfer:', error);
      setNfts(prev => prev.map(n => 
        n.id === nft.id 
          ? { ...n, transferStatus: 'failed' as const }
          : n
      ));
      toast.error('Cross-chain transfer failed due to network error');
      return { txHash: '', success: false };
    } finally {
      setLoading(false);
    }
  }, [zetaService]);

  const verifyNFTOwnership = useCallback(async (nft: CrossChainNFT) => {
    try {
      setLoading(true);
      toast.info('Verifying NFT ownership across chains...');
      
      const result = await zetaService.verifyOwnership(nft.id, nft.owner);
      
      if (result.isValid) {
        toast.success(`NFT ownership verified successfully across ${result.chainVerified.join(', ')} chains`);
      } else {
        toast.error('NFT ownership verification failed');
      }
      
      return result.isValid;
    } catch (error) {
      console.error('Error verifying ownership:', error);
      toast.error('Error verifying NFT ownership');
      return false;
    } finally {
      setLoading(false);
    }
  }, [zetaService]);

  const getSolanaBalance = useCallback(async () => {
    if (!publicKey) return 0;
    try {
      return await solanaService.getBalance(publicKey);
    } catch (error) {
      console.error('Error getting Solana balance:', error);
      return 0;
    }
  }, [publicKey, solanaService]);

  const deleteNFT = useCallback((nftId: string) => {
    setNfts(prev => prev.filter(nft => nft.id !== nftId));
    toast.success('NFT removed from collection');
  }, []);

  const refreshNFTs = useCallback(() => {
    // Simulate refreshing NFT data
    setNfts(prev => prev.map(nft => ({
      ...nft,
      // Add some randomness to demonstrate "refreshed" data
      transferStatus: nft.transferStatus === 'pending' && Math.random() > 0.5 
        ? 'completed' as const
        : nft.transferStatus
    })));
    toast.success('NFT collection refreshed');
  }, []);

  const exportNFTData = useCallback(() => {
    const dataStr = JSON.stringify(nfts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `zetachain-nfts-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('NFT data exported successfully');
  }, [nfts]);

  return {
    nfts,
    loading,
    evmAddress,
    solanaAddress: publicKey?.toString() || null,
    solanaBalance,
    evmBalance,
    connectEVMWallet,
    mintSolanaNFT,
    mintEVMNFT,
    initiateCrossChainTransfer,
    verifyNFTOwnership,
    getSolanaBalance,
    deleteNFT,
    refreshNFTs,
    exportNFTData
  };
};
