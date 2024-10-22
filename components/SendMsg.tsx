import { Box, Text, Button, Link } from "@interchain-ui/react";
import { useState } from "react";
import { useChain } from "@interchain-kit/react";
import { defaultChainName } from "@/config";
import { DEFAULT_SIGNING_CLIENT_QUERY_KEY } from 'interchainjs/react-query'
import { useGetBalance } from 'interchainjs/cosmos/bank/v1beta1/query.rpc.func'
import { useSend } from 'interchainjs/cosmos/bank/v1beta1/tx.rpc.func'
import { useQueryClient } from '@tanstack/react-query'
import { assetLists, chains } from '@chain-registry/v2';
import { defaultRpcEndpoint as rpcEndpoint } from '@/config';

import { useRpcClient } from 'interchainjs/react-query'
import { QueryClientContext } from "./SharingContext";
import BigNumber from "bignumber.js";

export default function SendMsg() {
  const assetList = assetLists.find(assetList => assetList.chainName === defaultChainName);
  const coin = assetList?.assets[0];

  const denom = coin!.base!

  const COIN_DISPLAY_EXPONENT = coin!.denomUnits.find(
    (unit) => unit.denom === coin!.display
  )?.exponent as number;

  const chain = chains.find(chain => chain.chainName === defaultChainName);
  const txPage =  chain?.explorers?.[0].txPage

  const { address, signingClient, isLoading } = useChain(defaultChainName);
  const queryClient = useQueryClient({
    context: QueryClientContext
  });

  // set global signingClient
  queryClient.setQueryData([DEFAULT_SIGNING_CLIENT_QUERY_KEY], signingClient);

  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // use cached global signingClient inside
  const { mutate: send, isSuccess: isSendSuccess } = useSend({
    options: {
      context: QueryClientContext,
      onSuccess: (data:any) => {
        console.log('onSuccess', data)
        setTimeout(()=>{
          refetchBalance()
        }, 5000)
        if (data.code===0) {
          setTxHash(data.hash);
        } else {
          setError(data.rawLog||JSON.stringify(data||{}));
        }
        setSending(false);
      },
      onError: (error) => {
        console.log('onError', error)
        setError(error.message || 'Unknown error');
        setSending(false);
      },
    },
  });

  // set global rpcClient
  useRpcClient({
    rpcEndpoint,
    options: {
      context: QueryClientContext,
      enabled: !!rpcEndpoint,
    },
  });

  const {
    data: balance,
    isSuccess: isBalanceLoaded,
    isLoading: isFetchingBalance,
    refetch: refetchBalance,
  } = useGetBalance({ // use cached global rpcClient inside
    request: {
      address,
      denom,
    },
    rpcEndpoint,
    options: {
      context: QueryClientContext,
      enabled: !!address,
      select: ({ balance }) =>
        new BigNumber(balance?.amount ?? 0).multipliedBy(
          10 ** -COIN_DISPLAY_EXPONENT
        ),
    },
  });

  const handleSend = async () => {
    if (sending || isLoading) return;

    setError(null);
    setTxHash(null);
    setSending(true);
    send({
      signerAddress: address,
      message: {
        fromAddress: address,
        toAddress: address,
        amount: [{ denom, amount: '1' }],
      },
      fee: {
        amount: [
          {
            denom,
            amount: '25000',
          },
        ],
        gas: '1000000',
      },
      memo: 'using interchainjs',
    })
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box mb='$4'>
        <Text fontSize='$2xl'>Balance: {isFetchingBalance?'--':(balance?.toFixed(COIN_DISPLAY_EXPONENT))} {assetList?.assets[0].symbol}</Text>
      </Box>
      <Box>
        <Button
          disabled={sending || isLoading}
          isLoading={sending}
          onClick={handleSend}
        >{isLoading?'Initializing...':'Send Token'}</Button>
      </Box>
      {txHash && <Box mt='$4' display='flex' flexDirection='row' alignItems='center'>
        <Text attributes={{ mr: '$1' }}>Details:</Text>
        <Link href={txPage?.replace('${txHash}', txHash)!} target="_blank">
          {txPage?.replace('${txHash}', txHash)!}
        </Link>
      </Box>}
      {error && <Box mt='$4' display='flex' flexDirection='row' alignItems='center'>
        <Text attributes={{ mr: '$1' }} fontSize='$2xl'>Error:</Text>
        <Text fontSize='$2xl'>{error}</Text>
      </Box>}
    </Box>
  );
}