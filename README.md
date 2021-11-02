# HDCORE TS


## Introduction
Hdcore-ts helps with hardened key generation and transaction building problem for developers.

This library mainly use testnet for speed testing. 

## Installation

```shell
npm i hdcore-ts
```

## Usage
Create keypair using 'account' and transaction using 'transaction' in 'COMPONENTS'
```ts
import {account, COMPONENTS} from 'hdcore-ts'
```

+ Create account:
    + Use * from account.ts (createMasterAccount, createChildAccount) => {'pub': ..., 'prv': ..., }
    + Create master account function auto have the PATH, only pass PATH as parameter when you want create child keys... for general upgrade purposes.
    + User desgin to have number of Key generations (by useing path generation)

+ Other utils functions:
    + Get each blockchain function in constants.ts
    + Get publickey
    + Get address
    + Get derivation path (auto hardened)



## Testing (Not done)

```shell
npm test
```

## References
- [Slip 10](https://github.com/satoshilabs/slips/blob/master/slip-0010.md)
- [Slip 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- [Bip 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [Bip 39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
  

## License

MIT
