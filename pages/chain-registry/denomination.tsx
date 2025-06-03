/**
 * refere to: https://github.com/hyperweb-io/chain-registry/blob/main/v2/packages/utils/README.md
 */

import { assetLists } from '@chain-registry/v2';
import {
  convertBaseUnitToDisplayUnit,
  convertDisplayUnitToBaseUnit,
} from '@chain-registry/v2-utils';
import { sepoliaAssetList } from './sepoliaAssetList';

export default function page() {
  const ethereumAssetList = assetLists.find(list => list.chainName === 'ethereum');
  console.log('ethereumAssetList!.assets', ethereumAssetList!.assets)

  const symbol = 'ETH'
  // const symbol = 'DAI'

  const display = convertBaseUnitToDisplayUnit(
    [ethereumAssetList!],
    symbol,
    '1000000000000000000'
  )
  const base = convertDisplayUnitToBaseUnit(
    [ethereumAssetList!],
    symbol,
    '1'
  );

  const baseSepolia = convertDisplayUnitToBaseUnit(
    [sepoliaAssetList],
    symbol,
    '1'
  );
  const displaySepolia = convertBaseUnitToDisplayUnit(
    [sepoliaAssetList],
    symbol,
    '1000000000000000000'
  )

  return (
    <div>
      <div>sepolia</div>
      <div>display: {displaySepolia} {symbol}</div>
      <div>base: {baseSepolia}</div>

      <hr />

      <div>Ethereum Mainnet</div>
      <div>display: {display} {symbol}</div>
      <div>base: {base}</div>
    </div>
  )
}