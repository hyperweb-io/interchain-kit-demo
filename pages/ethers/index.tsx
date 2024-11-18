import { Box, Button, Text } from "@interchain-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

export default function Index() {
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
      to: '0x0000000000000000000000000000000000000000',
      value: '1'
    })
    const res = await tx.wait();
    setResult(res)
    getBalance()
  }

  const getBalance = async () => {
    if (!window.ethereum) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    const wallet = await provider.getSigner()
    const balance = await provider.getBalance(wallet.getAddress())
    setBalance(ethers.formatEther(balance))
  }

  const signTypedDataTest = async () => {
    if (!window.ethereum) return
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const wallet = await provider.getSigner();
      const domain = {
        name: "TestApp",
        version: "1",
        chainId: await provider.getNetwork().then((net) => net.chainId),
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
      };

      const types = {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" }
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" }
        ]
      };

      const message = {
        from: { name: "Alice", wallet: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" },
        to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
        contents: "Hello, Bob!"
      };

      const signature = await wallet.signTypedData(domain, types, message);
      console.log("Signature:", signature);
      setResult({signature})
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