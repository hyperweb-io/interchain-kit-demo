import { assetLists, chains } from "@chain-registry/v2";

export const defaultChainName = 'cosmoshub'
export const defaultRpcEndpoint = 'https://rpc.cosmos.directory/cosmoshub'

export const defaultChain = chains.find((chain) => chain.chainName === defaultChainName)

export const defaultAssetList = assetLists.find((assetList) => assetList.chainName === defaultChainName)