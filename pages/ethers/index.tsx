import { Box, Button, Text } from "@interchain-ui/react";
import { ethers } from "ethers";

export default function Index() {
  const send = async () => {
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
    alert('Transaction sent, see console for details')
    console.log(res)
  }
  return <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
    <Button onClick={send}>Send</Button>
  </Box>
}