import { Transaction, Interface } from "ethers";
import { Box, Text, Button } from "@interchain-ui/react";
import { useEffect, useState } from "react";
import abi from './abi.json'
const JSONbig = require('json-bigint')

export default function ParseTx() {
  const iface = new Interface(abi)

  const [rawTx, setRawTx] = useState("");
  const [decodedTx, setDecodedTx] = useState<Transaction | null>(null);
  const [dataDecoded, setDataDecoded] = useState<object | null>(null)

  useEffect(()=>{
    if (!decodedTx) return
    setDataDecoded({dataDecoded:iface.parseTransaction({ data: decodedTx.data })})
  }, [decodedTx])
  
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

    {dataDecoded&&<Text attributes={{whiteSpace: 'pre-line', padding: '2rem'}} as="div">
      {JSONbig.stringify(dataDecoded, null, 2)}
    </Text>}
</Box>
)
}
