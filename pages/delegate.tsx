import { ReactNoSSR } from '@interchain-ui/react-no-ssr';
import { Button, Divider, Link } from '@interchain-ui/react';
import { Layout, Wallet } from '@/components';
import { useChain } from "@interchain-kit/react";
import { defaultAssetList, defaultChain, defaultChainName } from "@/config";
import { Box, Text } from '@interchain-ui/react';
import { WalletState } from '@interchain-kit/core'
import { useDelegate } from 'interchainjs/cosmos/staking/v1beta1/tx.rpc.func'
import { useGetValidators } from 'interchainjs/cosmos/staking/v1beta1/query.rpc.func'
import { defaultContext } from '@tanstack/react-query'
import { useEffect, useState } from 'react';
import { defaultRpcEndpoint as clientResolver } from '@/config';

export default function Home() {
  const { status } = useChain(defaultChainName);
  return (
    <Layout>
      <ReactNoSSR>
        <Wallet />
        <Divider mt="$10" mb="$16" />
        {status === WalletState.Connected ?
          <Delegate /> :
          <Box textAlign="center">
            <Text color="$gray600" fontSize="$xl" attributes={{ my: '$20' }}>
              Please connect to your wallet.
            </Text>
          </Box>
        }
        <Divider mt="$18" mb="$20" />
      </ReactNoSSR>
    </Layout>
  );
}

function Delegate() {
  const coin = defaultAssetList?.assets[0];
  const denom = coin!.base!
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validatorAddress, setValidatorAddress] = useState<string>();

  const chain = defaultChain
  const txPage =  chain?.explorers?.[0].txPage

  const { address, signingClient, isLoading } = useChain(defaultChainName);
  const { mutate: delegate, isSuccess: isDelegateSuccess } = useDelegate({
    clientResolver: signingClient,
    options: {
      context: defaultContext,
      onSuccess: (data:any) => {
        console.log('onSuccess', data)
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

  const {
    data,
    isSuccess: isGetValidatorsDone,
    isLoading: isGetValidatorsLoading,
  } = useGetValidators({
    request: {
      status: 'BOND_STATUS_BONDED',
    },
    options: {
      context: defaultContext,
      enabled: !validatorAddress,
    },
    clientResolver,
  })

  useEffect(() => {
    if (data?.validators[0]?.operatorAddress !== validatorAddress) {
      setValidatorAddress(data?.validators[0]?.operatorAddress);
    }
  }, [data, validatorAddress]);

  const handleDelegate = () => {
    if (sending || isLoading || !validatorAddress) return;
    setError(null);
    setTxHash(null);
    setSending(true);
    delegate({
      signerAddress: address,
      message: {
        delegatorAddress: address,
        validatorAddress,
        amount: {
          denom,
          amount: '1',
        },
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
    });
  }

  return <Box display="flex" flexDirection="column" alignItems="center">
    <Box mb='$4'>
      <Text fontSize='$2xl'>validatorAddress: {validatorAddress}</Text>
    </Box>
    <Box>
      <Button
        disabled={sending || isLoading}
        isLoading={sending}
        onClick={handleDelegate}
      >{isLoading?'Initializing...':'Delegate'}</Button>
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
  </Box>;
}