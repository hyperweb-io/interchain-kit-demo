### Add BNB Chain Testnet to MetaMask
| Key | Value |
|-------|-------|
| RPC URL | https://data-seed-prebsc-1-s1.binance.org:8545 |
| Chain ID | 97 |
| Currency symbol | tBNB |
| Block explorer URL | https://testnet.bscscan.com |

### If using /ethers/private-key
- 👏 You can tract all rpc process in the console of the browser
- Please set NEXT_PUBLIC_PRIVATE_KEY in .env.local
- example of sending eth
  ```
  fetch("https://data-seed-prebsc-1-s1.binance.org:8545/", {
    "headers": {
      "content-type": "application/json",
    },
    "referrer": "http://localhost:3000/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "[{\"method\":\"eth_blockNumber\",\"params\":[],\"id\":13,\"jsonrpc\":\"2.0\"},{\"method\":\"eth_sendRawTransaction\",\"params\":[\"0xf86506850d44594560825208940000000000000000000000000000000000000000018081e5a018564c40e7fdb832890e98289cd6e3075199a441f5045d4cef0019e55d3ee9c2a0694c0194dcb010e4df7ef4ea1f38fd6c2f94f8488ebf173dbdb8b6f83397a742\"],\"id\":14,\"jsonrpc\":\"2.0\"},{\"method\":\"eth_chainId\",\"params\":[],\"id\":15,\"jsonrpc\":\"2.0\"}]",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });
  ```
- example of smart contract interaction
  ```
  fetch("https://data-seed-prebsc-1-s1.binance.org:8545/", {
    "headers": {
      "content-type": "application/json",
    },
    "referrer": "http://localhost:3000/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "[{\"method\":\"eth_blockNumber\",\"params\":[],\"id\":49,\"jsonrpc\":\"2.0\"},{\"method\":\"eth_sendRawTransaction\",\"params\":[\"0xf9014b07850feb9e53408301b11194f67a42d581eb7d83135de8dfe2fccce58e5259bc01b8e46468328e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000416972eaf56fddf91ecabe651c18c551f2691a896962bfd2d7f12042fb4c2a389a5539977999468789caa8648430f0eacc2e3a9a20c03657d377b0074405661ddb1c0000000000000000000000000000000000000000000000000000000000000081e5a0dbd68c1fd096f77c763dd94f62431c04a2ee9e5bed2a0e391ea87c31728d7e3ca02ecf14b3ae912bf7349c7246bc9f4860dde7767cb9348e6f1b9be9a5886583db\"],\"id\":50,\"jsonrpc\":\"2.0\"},{\"method\":\"eth_chainId\",\"params\":[],\"id\":51,\"jsonrpc\":\"2.0\"}]",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });
  ```
  6972eaf56fddf91ecabe651c18c551f2691a896962bfd2d7f12042fb4c2a389a5539977999468789caa8648430f0eacc2e3a9a20c03657d377b0074405661ddb1c is the signature from signTypedData