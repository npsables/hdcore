import * as bip32 from 'bip32'
import { derivePath } from 'ed25519-hd-key'
import { Keypair, PublicKey} from '@solana/web3.js';
// import { ARRAY_INDEX } from '../constants'; 
import * as nacl from 'tweetnacl';

export const create_solana_pair = function (seed: string, path?: string): {}  {
     if (!path) {
          path = `m/44'/501'/0'/0'`;
     }
     const derive_seed = derivePath(path, seed).key.toString('hex');
     const derive_arr = Uint8Array.from(Buffer.from(derive_seed, 'hex'));
     const sec = nacl.sign.keyPair.fromSeed(derive_arr).secretKey;
     const pair = Keypair.fromSecretKey(sec);

     if (!pair) throw new Error('Cannot get Keypair')
     if (!PublicKey.isOnCurve(pair.publicKey.toBuffer())) throw new Error('Invalid PublicKey generation')
     return {'pub': pair.publicKey, 'prv': pair.secretKey }
}

export const get_address = function (publicKey: PublicKey): string {
     return publicKey.toBase58();
} 
