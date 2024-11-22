import { Box, Button, Text } from "@interchain-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import abi from './abi.json'

export default function Index() {
  const verifyingContract = '0xf67a42D581eB7d83135De8Dfe2fCccE58e5259bc'
  const addr0 = '0x0000000000000000000000000000000000000000'

  const [balance, setBalance] = useState('--')
  const [result, setResult] = useState<object | null>(null)

  const send = async () => {
    setResult(null)
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const wallet = await provider.getSigner()
    // wallet.signTypedData()
    const tx = await wallet.sendTransaction({
      to: addr0,
      value: '1'
    })
    const res = await tx.wait();
    setResult(res)
    getBalance()
  }

  const getBalance = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const wallet = await provider.getSigner()
    const address = await wallet.getAddress()
    console.log('address', address)
    const balance = await provider.getBalance(address)
    setBalance(ethers.formatEther(balance))
  }

  const signTypedDataTest = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
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

  return <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom="1rem">
      <Text attributes={{marginRight: '1rem'}}>Balance: {balance}</Text>
      <Button onClick={getBalance} size="sm">Fetch</Button>
    </Box>
    <Button onClick={send}>Send</Button>
    <Button onClick={signTypedDataTest} attributes={{marginTop: '1rem'}}>signTypedDataTest</Button>
    {result && <Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">{JSON.stringify(result, null, 2)}</Text>}
  </Box>
}