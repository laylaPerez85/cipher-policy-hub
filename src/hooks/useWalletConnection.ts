import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount();
  const [isWalletReady, setIsWalletReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // 检查钱包是否可用
        if (!window.ethereum) {
          setConnectionError('No wallet detected. Please install MetaMask or another compatible wallet.');
          return;
        }

        // 检查网络连接
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
        // 检查是否连接到 Sepolia 测试网
        if (chainId !== '0xaa36a7') {
          console.warn('Not connected to Sepolia testnet. Current chain:', chainId);
          setConnectionError('Please switch to Sepolia testnet');
          return;
        }

        // 检查账户连接状态
        if (isConnected && address) {
          setIsWalletReady(true);
          setConnectionError(null);
        } else {
          setIsWalletReady(false);
          setConnectionError('Wallet not connected');
        }
      } catch (error) {
        console.error('Wallet connection check failed:', error);
        setConnectionError('Failed to check wallet connection');
        setIsWalletReady(false);
      }
    };

    // 延迟检查以确保钱包完全初始化
    const timeoutId = setTimeout(checkWalletConnection, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [address, isConnected, isConnecting]);

  return {
    isWalletReady,
    connectionError,
    address,
    isConnected,
    isConnecting
  };
}
