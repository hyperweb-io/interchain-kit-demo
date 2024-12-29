import React, { useCallback } from 'react';
import { Button, Box } from '@interchain-ui/react';
import { ContractEncoder, AbiFunctionItem } from '@/utils/ethereum/ContractEncoder';
import abi from './usdt.abi.json';

export default function Erc20() {

  const usdt = new ContractEncoder(abi as AbiFunctionItem[]);
  
  const data = usdt.transfer(
    '0x1111111111111111111111111111111111111111', // receiver address
    10**17 // 0.1 USDT
  )

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