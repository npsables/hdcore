import * as bip39 from "bip39";
import { Keypair, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import { randomBytes } from "tweetnacl";
import { COMPONENTS } from "./constants";

/* TODO: client ask for creating wallet
  + 1st: gen mnemonic
  + 2nd: gen seed
  + pass seed through all declare wallet
  return: list of Account!!!
*/

const account = {
    
    createMnemonic: (bytes: number = 256) => {
      return bip39.generateMnemonic(bytes);
    },

    createSeed: (mnemonic: string) : Buffer | string => {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid seed words');
      }
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      return seed;
    },

    createMasterAccount: (coin_type:number): {pub: number; private: number;} => {
        if (coin_type in Object.keys(COMPONENTS)):
        return;

    },

    createChildAccount: (coin_type:number, index:string): {pub: number; private: number;} => {
      if (coin_type in Object.keys(COMPONENTS))
          return;

    },

    getPath : (accountIndex: number, coinType: number, addressIndex: number): string => {
        return `m/${this.purpose}'/${this.coinType}'/${accountIndex}'/${Number(isInternalChain)}'/${addressIndex}'`
    },


} 
