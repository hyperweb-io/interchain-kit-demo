import { assetLists, chains } from "@chain-registry/v2";

export const defaultChainName = 'cosmoshub'
export const defaultRpcEndpoint = 'https://cosmos-rpc.publicnode.com'

export const defaultChain = chains.find((chain) => chain.chainName === defaultChainName)

export const defaultAssetList = assetLists.find((assetList) => assetList.chainName === defaultChainName)