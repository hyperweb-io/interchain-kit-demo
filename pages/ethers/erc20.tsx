import React, { useCallback } from 'react';
import { Button, Box } from '@interchain-ui/react';

export default function Erc20() {
  
  const data = 
    '0xa9059cbb' + // Keccak256 of "transfer(address,uint256)"
    '0000000000000000000000001111111111111111111111111111111111111111' + // to address
    '000000000000000000000000000000000000000000000000000000000000000001'; // amount

  const contractAddress = "0x4EFbC939b905785e9c27A3A37047fAd18c40e08e";
  const bscTestnetChainId = '0x61'; // 97 in decimal
  
  const sendTransaction = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not installed');
      return;
    }

    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;

      if (currentChainId.toLowerCase() !== bscTestnetChainId) {
        alert("Please switch to BSC testnet (chainId: 97) on the metamask");
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      const from = accounts[0];

      const transactionParameters = {
        from: from,
        to: contractAddress, 
        value: '0x0',
        data: data,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      const scanUrl = `https://testnet.bscscan.com/tx/${txHash}`;
      console.log('Transaction details:', scanUrl);
      const shouldOpen = confirm(`Transcation sent, view details on BSC testnet scan?\n${scanUrl}`);
      if (shouldOpen) {
        window.open(scanUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Transaction failed:', error.message || error);
    }
  }, [data, contractAddress]);

  return (
    <Box>
      <Button onClick={sendTransaction}>Send USDT</Button>
    </Box>
  );
}