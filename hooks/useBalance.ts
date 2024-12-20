import { createGetBalance } from 'interchainjs/cosmos/bank/v1beta1/query.rpc.func'
import { defaultRpcEndpoint as rpcEndpoint } from '@/config';
import BigNumber from "bignumber.js";
import { defaultAssetList } from "@/config";
import { useEffect, useState } from 'react';

export default function useBalance({
  address,
}:{
  address: string,
}) {

  const coin = defaultAssetList?.assets[0];
  const denom = coin!.base!
  const COIN_DISPLAY_EXPONENT = coin!.denomUnits.find(
    (unit) => unit.denom === coin!.display
  )?.exponent as number;

  const [balance, setBalance] = useState<BigNumber | null>(null);

  useEffect(() => {
    const getBalance = createGetBalance(rpcEndpoint);
    getBalance({
      address,
      denom,
    }).then(({balance})=>{
      setBalance(new BigNumber(balance?.amount ?? 0).multipliedBy(  10 ** -COIN_DISPLAY_EXPONENT))
    })
  }, [address, denom, COIN_DISPLAY_EXPONENT]);

  return {
    balance
  }
}
