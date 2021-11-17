# HDCORE TS


## Introduction
Hdcore-ts helps with hardened key generation and transaction problems for Hierarchical Deterministic Wallets.
(Haven't deal with utxo blockchain)

## Installation

```shell
npm i hdcore-ts
```

## Usage
```ts
import * as hdcore from 'hdcore-ts'
```

Example on Solana: 
+ bip39 generation: 
```ts
const mnem =  hdcore.account.createMnemonic()
const seed = hdcore.account.createSeed(mnem)
```

+ Master account generation on Solana: 
```ts
const master = hdcore.account.createMasterAccount('501', seed)      
// {pub: ..., prv: ...}
```


+ Child account generation on Solana: 
```ts
const childindex = 1
const path = hdcore.account.getPath(0,501,1)                       
 //("m/44'/501'/0'/0'/1'")
const acc1 = hdcore.account.createMasterAccount('501', seed, path)
```

+ Fund account: (devnet solana) 
```ts
const transaction = hdcore.account.getTransaction('501')
transaction.airdrop_one(a.pub)                                      
// true
```

+ Get balance: (devnet solana)
```ts
transaction.get_balance(acc1.pub)                                   
// 1
```

+ Send: (devnet solana)
```ts
transaction.send(acc1.pub, acc1.prv, "recieve pubkey", 0.05)   
// return transaction id
```


## Testing (Not done)

```shell
npm test
```

## References
- [Sen JS](https://github.com/DescartesNetwork/sen-js)
- [Slip 10](https://github.com/satoshilabs/slips/blob/master/slip-0010.md)
- [Slip 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- [Bip 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [Bip 39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
  

## License

MIT
