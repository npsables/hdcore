// import * as bip32 from 'bip32'
import { derivePath } from 'ed25519-hd-key'
import { Keypair, PublicKey} from '@solana/web3.js';
// import { ARRAY_INDEX } from '../constants'; 
import * as nacl from 'tweetnacl';


/**
 * Create Solana key pair
 * @param seed string
 * @param path string, if no path passed, create master key pair
 * @returns true/false
 */
export const create_solana_pair = function (seed: string | Buffer, path?: string): {}  {
     if (!path) {
          path = `m/44'/501'/0'/0'`;
     }
     if (typeof seed === 'object'){
          seed = seed.toString('hex')
     }
     const derive_seed = derivePath(path, seed).key.toString('hex');
     const derive_arr = Uint8Array.from(Buffer.from(derive_seed, 'hex'));
     const sec = nacl.sign.keyPair.fromSeed(derive_arr).secretKey;
     const pair = Keypair.fromSecretKey(sec);

     if (!pair) throw new Error('Cannot get Keypair')
     if (!PublicKey.isOnCurve(pair.publicKey.toBuffer())) throw new Error('Invalid PublicKey generation')
     return {'pub': pair.publicKey, 'prv': pair.secretKey }
}

/**
 * get address of account
 * @param publicKey publicKey from solanajs
 * @returns base58 string
 */
export const get_solana_address = function (publicKey: PublicKey): boolean | string {
     try {
          const pub = new PublicKey(publicKey)
          if (!pub) throw new Error('Invalid public key')
          return publicKey.toBase58()
     } catch (e) {
          return false
     }
} 

// TODO: how to check if address has been used?