import { AssetList } from '@chain-registry/v2-types';

export const sepoliaAssetList: AssetList = {
  chainName: 'sepolia',
  assets: [
    {
      description: 'Sepolia Ether is the native token for the Sepolia Ethereum testnet.',
      denomUnits: [
        { denom: 'wei', exponent: 0 },
        { denom: 'gwei', exponent: 9 },
        { denom: 'eth', exponent: 18, aliases: ['ether'] }
      ],
      typeAsset: 'evm-base',
      base: 'wei',
      name: 'Sepolia Ether',
      display: 'eth',
      symbol: 'ETH',
      logoURIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/eth-white.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/eth-white.svg'
      },
      coingeckoId: 'ethereum'
    },
    {
      description: 'DAI on Sepolia testnet (for testing purposes only).',
      typeAsset: 'erc20',
      address: '0x0000000000000000000000000000000000000000', // Replace with actual DAI contract address
      denomUnits: [
        { denom: '0x0000000000000000000000000000000000000000', exponent: 0, aliases: ['dai-wei'] },
        { denom: 'dai', exponent: 18 }
      ],
      base: '0x0000000000000000000000000000000000000000', // Replace with actual DAI contract address
      name: 'Dai Stablecoin (Sepolia)',
      display: 'dai',
      symbol: 'DAI',
      logoURIs: {
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/dai.svg'
      },
      coingeckoId: 'dai'
    }
  ]
};