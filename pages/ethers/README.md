1. use ganache js to run a ethereum node locally
```
npx ganache \
  --account="0x0000000000000000000000000000000000000000000000000000000000000001,1000000000000000000" \
  --account="0x0000000000000000000000000000000000000000000000000000000000000002,1000000000000000000"
```
2. Add an account to MetaMask using the private keys above
3. Add the local ethereum node as a network in MetaMask
```
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
Currency: ETH
```