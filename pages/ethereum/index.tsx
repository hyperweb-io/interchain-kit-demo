import { Box, Button, Text } from "@interchain-ui/react";
import { SignerFromBrowser } from "@interchainjs/ethereum/signers/SignerFromBrowser"
import { TransactionReceipt } from "@interchainjs/ethereum/types/transaction";
import { useEffect, useState } from "react";
import { IEthereumProvider } from "@keplr-wallet/types";
import { MetaMaskInpageProvider } from "@metamask/providers";
import BigNumber from "bignumber.js";

type EthereumProvider = MetaMaskInpageProvider | IEthereumProvider | undefined
type EthereumProviderType = 'keplr' | 'metamask'

export default function Index() {
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

  const send = async (type: 'EIP1559'|'pre-EIP1559'='pre-EIP1559') => {
    setResult(null)
    if (!ethereum) {
      alert('Please install MetaMask')
      return
    }
    const wallet = new SignerFromBrowser(ethereum)
    let res:TransactionReceipt
    if (type==='EIP1559') {
      const tx = await wallet.sendEIP1559({
        to: addr0,
        value: 1n,
      })
      console.log('tx', tx)
      res = await tx.wait();
    } else {
      const tx = await wallet.send({
        to: addr0,
        value: 1n,
      })
      console.log('tx', tx)
      res = await tx.wait();
    }
    setResult(res)
    getBalance()
  }

  const getBalance = async () => {
    if (!ethereum) {
      alert('Please install MetaMask')
      return
    }
    const wallet = new SignerFromBrowser(ethereum)
    const address = await wallet.getAddress()
    console.log('address', address)
    const balance = await wallet.getBalance()
    setBalance(new BigNumber(balance.toString()).div(10**18).toString())
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
    <Button onClick={send}>Send by pre-EIP1559</Button>
    <Button onClick={()=>send('EIP1559')} attributes={{marginTop: '1rem'}}>Send by EIP1559</Button>
    <Button onClick={addEthereumChain} attributes={{marginTop: '1rem'}}>addEthereumChain</Button>
    {result && <Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">{JSON.stringify(result, null, 2)}</Text>}
  </Box>
}