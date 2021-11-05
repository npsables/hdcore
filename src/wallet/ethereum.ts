// import {hdkey} from 'ethereumjs-wallet'
const hdkey = require('hdkey')
import * as ethUtil from 'ethereumjs-util'
import { default as Web3 } from 'web3'
import { PROVIDER_ROPSTEN } from '../constants'
import { Transaction } from 'ethereumjs-tx'
/**
 * Create Ethereum key pair
 * @param seed string
 * @param path string, if no path passed, create master key pair
 * @returns true/false
 */
export const create_ethereum_pair = function (seed: string | Buffer, path?: string): {} {
     if (!path) path = `m/44'/1'/0'/0'`;
     if (typeof seed === 'string') {
          seed = Buffer.from(seed, 'hex')
     }
     const root = hdkey.fromMasterSeed(seed);
     const child = root.derive(path);
     if (!child) throw new Error('Cannot get Keypair');
     return { 'pub': child.publicKey, 'prv': child.privateKey }
}


/**
 * get address of account
 * @param publicKey publicKey from @function create_ethereum_pair
 * @returns base58 string
 */
export const get_ethereum_address = function (publicKey: Buffer): string {
     try {
          const addr = '0x' + ethUtil.pubToAddress(publicKey, true).toString('hex');
          const address = ethUtil.toChecksumAddress(addr);
          return address
     } catch (e) {
          throw new Error("Cant gen ether address: " + e)
     }
}


export const ethereum_tx = {

     /**
      * Build transaction (Price set to high value for testing) 
      * @param network? option(dev/testnet), auto devnet
      * @param pubkey 
      * @returns hex transaction hash
      */
     send_tx: async (publicKey: Buffer, privateKey: Buffer, recieveAddress: string, amount: number, fee?: number, http_provider?: string, chain?: string): Promise<string> => {
          if (!http_provider) {
               http_provider = PROVIDER_ROPSTEN;
               chain = 'ropsten'
          }
          const web3 = new Web3(http_provider);

          // build tx 
          if (!fee) fee = Number(await web3.eth.getGasPrice());
          const address = get_ethereum_address(publicKey);
          const nonce = Number(await web3.eth.getTransactionCount(address))
          const send_amount = amount * 10 ** 18;

          // fee ~ 1 GWei * 25 for fast confirmation (testnet of course)
          var rawTx = {
               from: address,
               nonce: web3.utils.toHex(nonce),
               gasPrice: web3.utils.toHex(fee ** 25),
               gasLimit: web3.utils.toHex('1000000'),
               to: recieveAddress,
               value: web3.utils.toHex(send_amount),
          }
          const tx = new Transaction(rawTx, { chain: chain })
          // sign
          tx.sign(privateKey);
          const serializedTx = tx.serialize();
          // send tx
          const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function (receipt) {
               console.log(receipt.status)
          }).on('error', console.error); ;;

          return result.transactionHash

     },

     /**
      * Get account balance 
      * @param network? option(dev/testnet), auto devnet
      * @param pubkey 
      * @returns false if sth wrong, othws number of sol
      */
     get_balance: async (publicKey: Buffer, http_provider?: string): Promise<number> => {
          if (!http_provider) http_provider = PROVIDER_ROPSTEN;
          const address = get_ethereum_address(publicKey);
          const web3 = new Web3(http_provider);
          const balance = Number(await web3.eth.getBalance(address));
          return balance
     },


     /** 
      * @TODO callback function on change
      * no need right now 
      */
     track: () => {

     },


     // /**
     //  * Airdrop 1 SOL
     //  * @param network? option(dev/testnet), auto devnet
     //  * @param pubkey 
     //  * @returns
     //  */
     // airdrop_one: async (pubkey: PublicKey, network?: string,): Promise<boolean> => {
     // }
}
