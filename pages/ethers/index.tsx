import { Box, Button, Text } from "@interchain-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from './abi.json'
import { IEthereumProvider } from "@keplr-wallet/types";
import { MetaMaskInpageProvider } from "@metamask/providers";

type EthereumProvider = MetaMaskInpageProvider | IEthereumProvider | undefined
type EthereumProviderType = 'keplr' | 'metamask'

export default function Index() {
  const verifyingContract = '0xf67a42D581eB7d83135De8Dfe2fCccE58e5259bc'
  const addr0 = '0x0000000000000000000000000000000000000000'

  const [balance, setBalance] = useState('--')
  const [result, setResult] = useState<object | null>(null)
  const [ethereum, setEthereum] = useState<EthereumProvider>()
  const [selectedWallet, setSelectedWallet] = useState<EthereumProviderType>('metamask')

  useEffect(()=>{
    let ethereum:EthereumProvider = window.ethereum
    if (selectedWallet === 'keplr') {
      ethereum = window.keplr?.ethereum
    }
    setEthereum(ethereum)
  }, [selectedWallet])

  const send = async () => {
    setResult(null)
    if (!ethereum) {
      alert('Please install MetaMask')
      return
    }
    const provider = new ethers.BrowserProvider(ethereum)
    const wallet = await provider.getSigner()
    const tx = await wallet.sendTransaction({
      to: addr0,
      value: '1'
    })
    console.log('tx', tx)
    const res = await tx.wait();
    setResult(res)
    getBalance()
  }

  const getBalance = async () => {
    if (!ethereum) {
      alert('Please install MetaMask')
      return
    }
    const provider = new ethers.BrowserProvider(ethereum)
    const wallet = await provider.getSigner()
    const address = await wallet.getAddress()
    console.log('address', address)
    const balance = await provider.getBalance(address)
    setBalance(ethers.formatEther(balance))
  }

  const signTypedDataTest = async () => {
    if (!ethereum) {
      alert('Please install MetaMask')
      return
    }
    
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const wallet = await provider.getSigner();

      const domain = {
        name: "ETHTransfer",
        version: "1",
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract,
      };

      const types = {
        Transfer: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" }
        ]
      };

      const message = {
        to: addr0,
        amount: '1'
      };

      const signature = await wallet.signTypedData(domain, types, message);
      console.log("Signature:", signature);
      setResult({signature})
      const contract = new ethers.Contract(
        verifyingContract,
        abi,
        wallet
      );
      
      const tx = await contract.executeTransfer(
        addr0,
        '1',
        signature,
        { value: '1' }
      );
      
      const res = await tx.wait();
      
      setResult({signature, res})
    } catch (error:any) {
      console.error("Error signing typed data:", error);
      alert(`Error: ${error.message}`)
    }
  }

  async function addEthereumChain() {
    if (ethereum) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '0x61',
              chainName: "BSC Test",
              nativeCurrency: {
                name: "tBNB",
                symbol: "tBNB",
                decimals: 18,
              },
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              blockExplorerUrls: ["https://testnet.bscscan.com"]
            },
          ],
        });
        console.log("added");
      } catch (error) {
        console.error("error wallet_addEthereumChain", error);
      }
    } else {
      console.error("metamask not installed");
    }
  }

  return <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
    <Box marginY='1rem'>
      <label>
        <input
          type="radio"
          name="options"
          value="keplr"
          checked={selectedWallet === "keplr"}
          onChange={(e)=>setSelectedWallet(e.target.value as EthereumProviderType)}
        />
        <Text as="span">Keplr</Text>
      </label>
      <label>
        <input
          type="radio"
          name="options"
          value="metamask"
          checked={selectedWallet === "metamask"}
          onChange={(e)=>setSelectedWallet(e.target.value as EthereumProviderType)}
        />
        <Text as="span">MetaMask</Text>
      </label>
    </Box>
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom="1rem">
      <Text attributes={{marginRight: '1rem'}}>Balance: {balance}</Text>
      <Button onClick={getBalance} size="sm">Fetch</Button>
    </Box>
    <Button onClick={send}>Send</Button>
    <Button onClick={signTypedDataTest} attributes={{marginTop: '1rem'}}>signTypedDataTest</Button>
    <Button onClick={addEthereumChain} attributes={{marginTop: '1rem'}}>addEthereumChain</Button>
    {result && <Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">{JSON.stringify(result, null, 2)}</Text>}
  </Box>
}