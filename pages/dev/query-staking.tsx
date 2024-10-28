import { Box, Text } from "@interchain-ui/react";
import { useEffect, useState } from "react";
import { useChain } from "@interchain-kit/react";
import { defaultAssetList, defaultChainName } from "@/config";
import { useGetPool } from 'interchainjs/cosmos/staking/v1beta1/query.rpc.func'
import { defaultContext, useQueryClient } from '@tanstack/react-query'
import { defaultRpcEndpoint as rpcEndpoint } from '@/config';

import { useRpcClient } from 'interchainjs/react-query'
import { Pool } from "interchainjs/cosmos/staking/v1beta1/staking";

export default function QueryStaking() {
  const coin = defaultAssetList?.assets[0];
  const denom = coin!.base!

  const [pool, setPool] = useState<Pool|null>(null);

  useEffect(() => {
    console.log('pool useEffect', pool)
  }, [pool])

  const { address, signingClient, isLoading } = useChain(defaultChainName);
  const queryClient = useQueryClient({
    context: defaultContext
  });

  // set global signingClient
  queryClient.setQueryData(['query-staking'], signingClient);
  const [error, setError] = useState<string | null>(null);

  // set global rpcClient
  useRpcClient({
    rpcEndpoint,
    options: {
      context: defaultContext,
      enabled: !!rpcEndpoint,
    },
  });

  useGetPool({ // use cached global rpcClient inside
    request: {
      address,
      denom,
    },
    rpcEndpoint,
    options: {
      context: defaultContext,
      enabled: !isLoading,
      select: ({pool: _pool}) => {
        if (!pool) setPool(_pool)
      },
      onError: (err) => setError(err.message),
      onSuccess(data) {
        console.log('data, onSuccess', data)
      },
      onSettled(data, error) {
        console.log('data, onSettled', data, error)
      },
    },
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box mb='$4'>
        <Text fontSize='$2xl'>Result of useGetPool:</Text>
        <Text fontSize='$2xl'>
          {JSON.stringify(pool)}
        </Text>
      </Box>
      <Box>
        
      </Box>
      {error && <Box mt='$4' display='flex' flexDirection='row' alignItems='center'>
        <Text attributes={{ mr: '$1' }} fontSize='$2xl'>Error:</Text>
        <Text fontSize='$2xl'>{error}</Text>
      </Box>}
    </Box>
  );
}