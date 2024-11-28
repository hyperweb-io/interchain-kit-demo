import { Transaction } from "ethers";
import { TextField, Box, Text, Button } from "@interchain-ui/react";
import { useState } from "react";

export default function ParseTx() {
  const [rawTx, setRawTx] = useState("");
  const [decodedTx, setDecodedTx] = useState<Transaction | null>(null);
  
  return (
<Box display='flex' padding='20px' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh'>
    <textarea
      value={rawTx}
      onChange={(e) => setRawTx(e.target.value)}
      placeholder="eth_sendRawTransaction param"
      style={{width: '70vw', height: '20vh'}}
    />
    <Button onClick={() => {
        const decodedTx = Transaction.from(rawTx);
        setDecodedTx(decodedTx);
      }}
      attributes={{
        marginTop: '1rem'
      }}
    >Parse</Button>
    {decodedTx&&<Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">
      {JSON.stringify(decodedTx, null, 2)}
    </Text>}
</Box>
)
}
