import { Box, Button, Text } from "@interchain-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

export default function Index() {
  const [balance, setBalance] = useState('--')
  const [transactionReceipt, setTransactionReceipt] = useState<ethers.TransactionReceipt | null>(null)
  const send = async () => {
    setTransactionReceipt(null)
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const wallet = await provider.getSigner()
    const tx = await wallet.sendTransaction({
      to: '0x0000000000000000000000000000000000000000',
      value: '1'
    })
    const res = await tx.wait();
    setTransactionReceipt(res)
    getBalance()
  }

  const getBalance = async () => {
    if (!window.ethereum) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    const wallet = await provider.getSigner()
    const balance = await provider.getBalance(wallet.getAddress())
    setBalance(ethers.formatEther(balance))
  }
  return <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom="1rem">
      <Text attributes={{marginRight: '1rem'}}>Balance: {balance}</Text>
      <Button onClick={getBalance} size="sm">Fetch</Button>
    </Box>
    <Button onClick={send}>Send</Button>
    {transactionReceipt && <Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">{JSON.stringify(transactionReceipt, null, 2)}</Text>}
  </Box>
}