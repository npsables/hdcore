import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
// import { ARRAY_INDEX } from '../constants'; 
import * as nacl from 'tweetnacl';


/**
 * Create Bitcoin key pair
 * @param seed string
 * @param path string, if no path passed, create master key pair
 * @returns true/false
 */
export const create_bitcoin_testnet_pair = function (seed: string | Buffer, path?: string): {}  {
     if (!path) path = `m/44'/1'/0'/0'`;
     if (typeof seed === 'string'){
          seed = Buffer.from(seed, 'hex')
     }
     const root = bip32.fromSeed(seed, bitcoin.networks.testnet)
     const child = root.derivePath(path);
     if (!child) throw new Error('Cannot get Keypair');
     try {
          bitcoin.ECPair.fromWIF(child.toWIF(), [bitcoin.networks.bitcoin, bitcoin.networks.testnet])
     } catch(e){
          throw new Error('Invalid Key generation')
     }
     return {'pub': child.publicKey, 'prv': child.privateKey}
}

/**
 * get address of account
 * @param publicKey publicKey from solanajs
 * @returns base58 string
 */
export const get_bitcoin_testnet_address = function (publicKey: Buffer): string | undefined | boolean {
     try {
          const address = bitcoin.payments.p2pkh({
               pubkey: publicKey,
               network:  bitcoin.networks.testnet,           
           }).address;
          return address;
     } catch (e) {
          return false
     }
} 
