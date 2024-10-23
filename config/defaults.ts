import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';
import { assetLists, chains } from "@chain-registry/v2";

export const defaultChainName = 'cosmoshub'
export const defaultRpcEndpoint = 'https://rpc.cosmos.directory/cosmoshub'

export const chainassets = assets.find(
  (chain) => chain.chain_name === defaultChainName
) as AssetList;

export const coin = chainassets.assets[0] as Asset;

export const defaultChain = chains.find((chain) => chain.chainName === defaultChainName)

export const defaultAssetList = assetLists.find((assetList) => assetList.chainName === defaultChainName)